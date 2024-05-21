import json
import time
import uuid

import pika
import cv2
import redis
import numpy as np
import requests
from PIL import Image
import os

from cv2 import cuda
from celery import Celery, group
from celery.utils.log import get_task_logger
from celery.contrib.abortable import AbortableTask
from loguru import logger

celery = Celery(
    "tasks", broker=f"redis://localhost:6379", backend=f"redis://localhost:6379"
)
celery_log = get_task_logger(__name__)

cuda.printCudaDeviceInfo(0)
cv2.cuda.setDevice(0)

start_time = time.time()


def select_points(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        points_list, image = param
        points_list.append((x, y))
        cv2.circle(image, (x, y), 4, (0, 0, 255), -1)
        cv2.imshow("Image", image)


def get_real_cm2(roi_vertices, seg_mask):
    roi_vertices = np.array(roi_vertices)
    x, y, w, h = cv2.boundingRect(roi_vertices)

    known_roi_size_cm2 = 140.625
    pixel_to_real_ratio = known_roi_size_cm2 / (w * h)
    segmented_pixel_count = np.count_nonzero(seg_mask)
    real_area_cm2 = segmented_pixel_count * pixel_to_real_ratio

    return real_area_cm2, h


def process_calibation(fps, frames, min_flow_magnitude, lk_params, prev_points, mask, refresh_speed_counter,
                       fps_counter,
                       refresh_rate, roi_vertices, gpu_prev_gray, gpu_prev_gray_tracking, feature_params, area_cm2_list,
                       v_liters):
    roi_vertices = np.array(roi_vertices, np.int32)
    roi_vertices = roi_vertices.reshape((-1, 1, 2))

    space_to_pixels = 0.074
    speeds = []
    h_estimated_cm = 0.48148

    abcd_hist = []

    frame_counter = 0

    results = []

    for frame in frames:
        if frame_counter % 8 == 0:
            gray1 = gpu_prev_gray
            gray1_tracking = gpu_prev_gray_tracking
            gray2 = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray2_tracking = cv2.adaptiveThreshold(
                gray2, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2
            )
            gpu_gray2 = cv2.cuda_GpuMat()
            gpu_gray2.upload(gray2)

            gpu_flow = cv2.cuda_FarnebackOpticalFlow.create(
                5, 0.5, False, 15, 3, 5, 1.2, 0
            )
            gpu_flow = gpu_flow.calc(gray1, gpu_gray2, None)
            gpu_flow_x = cv2.cuda_GpuMat(gpu_flow.size(), cv2.CV_32FC1)
            gpu_flow_y = cv2.cuda_GpuMat(gpu_flow.size(), cv2.CV_32FC1)

            cv2.cuda.split(gpu_flow, [gpu_flow_x, gpu_flow_y])

            magnitude, _ = cv2.cuda.cartToPolar(gpu_flow_x, gpu_flow_y)

            threshold = 2
            seg_mask = magnitude.download() > threshold

            kernel = np.ones((5, 5), np.uint8)
            seg_mask = cv2.morphologyEx(
                seg_mask.astype(np.uint8), cv2.MORPH_CLOSE, kernel
            )

            masked_frame = frame.copy()
            masked_frame[seg_mask == 0] = [0, 0, 0]

            if refresh_speed_counter % refresh_rate == 0:
                prev_points = cv2.goodFeaturesToTrack(
                    gray2_tracking, mask=None, **feature_params
                )
                mask = np.zeros_like(frame)

            next_points, status, error = cv2.calcOpticalFlowPyrLK(
                gray1_tracking.download(),
                gray2_tracking,
                prev_points,
                None,
                **lk_params,
            )

            good_new = next_points[status == 1]
            good_old = prev_points[status == 1]

            for i, (new, old) in enumerate(zip(good_new, good_old)):
                a, b = new.ravel()
                c, d = old.ravel()
                a, b, c, d = int(a), int(b), int(c), int(d)

                if (
                        cv2.pointPolygonTest(roi_vertices, (a, b), False) >= 0
                        and -5 < (c - a) < 1
                ):
                    abcd_hist.append((c, a, d, b))

                    pixel_distance = np.sqrt((a - c) ** 2 + (b - d) ** 2)

                    real_distance = pixel_distance * space_to_pixels
                    time_elapsed = 1.0 / fps
                    speed = real_distance / time_elapsed

                    flow_vector = np.array([c - a, d - b], dtype=np.float32)
                    flow_magnitude = np.linalg.norm(flow_vector)
                    text = f"ID: {i}"

                    if flow_magnitude > min_flow_magnitude and 3 <= speed <= 20:
                        mask = cv2.line(mask, (a, b), (c, d), (0, 255, 0), 2)
                        frame = cv2.circle(frame, (a, b), 5, (0, 0, 255), -1)
                        cv2.putText(
                            frame,
                            text,
                            (a + 10, b - 10),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1.2,
                            (255, 255, 255),
                            1,
                            cv2.LINE_AA,
                        )
                        speeds.append(speed)

            average_speed = np.mean(speeds)
            if len(speeds) > 0:
                real_area_cm2, h = get_real_cm2(roi_vertices, seg_mask)
                real_h = h * space_to_pixels
                if fps_counter == 0 or fps_counter % round(fps * (real_h / average_speed)) == 0:
                    area_cm2_list.append(real_area_cm2)
                    v_liters.append(real_area_cm2 * h_estimated_cm / 1000)

            # print(fps_counter)

            total_shlam_square = round(sum(area_cm2_list))
            total_shlam_volume = sum(v_liters)

            gpu_prev_gray.upload(gray2.copy())
            prev_points = good_new.reshape(-1, 1, 2)
            refresh_speed_counter += 1

            metrics_to_save = {
                "total_shlam_square": total_shlam_square,
                "total_shlam_volume": total_shlam_volume,
                "average_speed": average_speed,
            }
            results.append(metrics_to_save)

        frame_counter += 1
        fps_counter += 1

    return {
        "results": results,
        "fps_counter": fps_counter,
        "area_cm2_list": area_cm2_list,
        "v_liters": v_liters
    }


def process_stream(fps, frames, min_flow_magnitude, lk_params, prev_points, mask, refresh_speed_counter, fps_counter,
                   refresh_rate, roi_vertices, gpu_prev_gray, gpu_prev_gray_tracking, feature_params, area_cm2_list,
                   v_liters, volume, sensitivity, total_shlam_square):
    roi_vertices = np.array(roi_vertices, np.int32)
    roi_vertices = roi_vertices.reshape((-1, 1, 2))

    space_to_pixels = 0.074
    speeds = []
    h_estimated_cm = float(volume) / float(total_shlam_square) * 1000

    abcd_hist = []

    frame_counter = 0

    results = []

    for frame in frames:
        if frame_counter % 8 == 0:
            gray1 = gpu_prev_gray
            gray1_tracking = gpu_prev_gray_tracking
            gray2 = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray2_tracking = cv2.adaptiveThreshold(
                gray2, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2
            )
            gpu_gray2 = cv2.cuda_GpuMat()
            gpu_gray2.upload(gray2)

            if sensitivity == '0':
                gpu_flow = cv2.cuda_FarnebackOpticalFlow.create(
                    5, 0.5, False, 15, 3, 5, 1.2, 0
                )
            else:
                gpu_flow = cv2.cuda_FarnebackOpticalFlow.create(
                    5, 0.5, False, 15, 3, 7, 1.7, 0
                )

            gpu_flow = gpu_flow.calc(gray1, gpu_gray2, None)
            gpu_flow_x = cv2.cuda_GpuMat(gpu_flow.size(), cv2.CV_32FC1)
            gpu_flow_y = cv2.cuda_GpuMat(gpu_flow.size(), cv2.CV_32FC1)

            cv2.cuda.split(gpu_flow, [gpu_flow_x, gpu_flow_y])

            magnitude, _ = cv2.cuda.cartToPolar(gpu_flow_x, gpu_flow_y)

            threshold = 2
            seg_mask = magnitude.download() > threshold

            kernel = np.ones((5, 5), np.uint8)
            seg_mask = cv2.morphologyEx(
                seg_mask.astype(np.uint8), cv2.MORPH_CLOSE, kernel
            )

            masked_frame = frame.copy()
            masked_frame[seg_mask == 0] = [0, 0, 0]

            if refresh_speed_counter % refresh_rate == 0:
                prev_points = cv2.goodFeaturesToTrack(
                    gray2_tracking, mask=None, **feature_params
                )
                mask = np.zeros_like(frame)

            next_points, status, error = cv2.calcOpticalFlowPyrLK(
                gray1_tracking.download(),
                gray2_tracking,
                prev_points,
                None,
                **lk_params,
            )

            good_new = next_points[status == 1]
            good_old = prev_points[status == 1]

            for i, (new, old) in enumerate(zip(good_new, good_old)):
                a, b = new.ravel()
                c, d = old.ravel()
                a, b, c, d = int(a), int(b), int(c), int(d)

                if (
                        cv2.pointPolygonTest(roi_vertices, (a, b), False) >= 0
                        and -5 < (c - a) < 1
                ):
                    abcd_hist.append((c, a, d, b))

                    pixel_distance = np.sqrt((a - c) ** 2 + (b - d) ** 2)

                    real_distance = pixel_distance * space_to_pixels
                    time_elapsed = 1.0 / fps
                    speed = real_distance / time_elapsed

                    flow_vector = np.array([c - a, d - b], dtype=np.float32)
                    flow_magnitude = np.linalg.norm(flow_vector)
                    text = f"ID: {i}"

                    if flow_magnitude > min_flow_magnitude and 3 <= speed <= 20:
                        mask = cv2.line(mask, (a, b), (c, d), (0, 255, 0), 2)
                        frame = cv2.circle(frame, (a, b), 5, (0, 0, 255), -1)
                        cv2.putText(
                            frame,
                            text,
                            (a + 10, b - 10),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1.2,
                            (255, 255, 255),
                            1,
                            cv2.LINE_AA,
                        )
                        speeds.append(speed)

            average_speed = np.mean(speeds)
            if len(speeds) > 0:
                real_area_cm2, h = get_real_cm2(roi_vertices, seg_mask)
                real_h = h * space_to_pixels
                if fps_counter == 0 or fps_counter % round(fps * (real_h / average_speed)) == 0:
                    area_cm2_list.append(real_area_cm2)
                    v_liters.append(real_area_cm2 * h_estimated_cm / 1000)

            # print(fps_counter)

            total_shlam_square = round(sum(area_cm2_list))
            total_shlam_volume = sum(v_liters)

            gpu_prev_gray.upload(gray2.copy())
            prev_points = good_new.reshape(-1, 1, 2)
            refresh_speed_counter += 1

            metrics_to_save = {
                "total_shlam_square": total_shlam_square,
                "total_shlam_volume": total_shlam_volume,
                "average_speed": average_speed,
            }
            results.append(metrics_to_save)

        frame_counter += 1
        fps_counter += 1

    return {
        "results": results,
        "fps_counter": fps_counter,
        "area_cm2_list": area_cm2_list,
        "v_liters": v_liters
    }


class RedisManager:
    def __init__(self) -> None:
        self.client = redis.Redis(host='localhost',
                                  port=6379,
                                  db=0)

    def set_info(self, camera_id, data):
        self.client.set(camera_id, json.dumps(data))
        self.client.persist(camera_id)

    def add_data(self, type_entity: str, type_operation: str, data: dict) -> str:
        if type_entity == 'camera':
            if type_operation == 'add':
                camera_id = str(uuid.uuid4())
                self.set_info(camera_id, data)
                return camera_id

            if type_operation == 'update':
                camera_id = data['id']
                del data['id']
                self.set_info(camera_id, data)

        if type_entity == 'wits':
            self.set_info('wits', data)
            self.client.persist('wits')
            return 'wits'

        if type_entity == 'job':
            self.set_info(data['id'], data)
            self.client.persist(data['id'])

        if type_entity == 'camers':
            self.set_info(data['camera_id'], data)
            self.client.persist(data['camera_id'])

        if type_entity == 'calib':
            self.set_info(data['calibration_id'], data)
            self.client.persist(data['calibration_id'])

    def get_data(self, slot_id: str) -> dict:
        value = self.client.get(slot_id)
        if value is None:
            return None
        return json.loads(value.decode("utf-8"))


class RabbitQueue:
    def __init__(self) -> None:
        max_retries = 5
        retries = 0

        while retries < max_retries:
            try:
                self.connection = pika.BlockingConnection(
                    pika.ConnectionParameters('localhost'),
                )
                self.channel = self.connection.channel()
                break
            except Exception as e:
                retries += 1
                logger.error(f"Failed to connect to RabbitMQ: {e}")
                if retries < max_retries:
                    logger.warning("Retrying connection in 5 seconds...")
                    time.sleep(5)
                else:
                    logger.error("Max connection retries reached. Exiting.")
                    raise

    def start_connection_queue(self, name_queue: str) -> None:
        self.channel.queue_declare(queue=name_queue)

    def stop_connection_queue(self) -> None:
        self.connection.close()

    def get_count_messages(self, name_queue: str) -> int:
        queue_declare_result = self.channel.queue_declare(queue=name_queue)
        return queue_declare_result.method.message_count

    def add_message_queue(self, name_queue: str, key: str, message_queue: any) -> None:
        self.start_connection_queue(name_queue)

        if isinstance(message_queue, (list, dict)):
            message_queue = json.dumps(message_queue)

        self.channel.basic_publish(exchange="", routing_key=key, body=message_queue)

    def check_queue(self, name_queue: str):
        self.start_connection_queue(name_queue)
        queue_messages = []
        while True:
            method_frame, header_frame, body = self.channel.basic_get(queue=name_queue)

            if method_frame:
                decoded_body = body.decode("utf-8")
                queue_messages.append(json.loads(decoded_body))

                self.channel.basic_ack(delivery_tag=method_frame.delivery_tag)
            else:
                break

        if queue_messages:
            return queue_messages
        else:
            return None

    def check_banch_msg(self, name_queue: str, banch_size: int = 24):
        self.start_connection_queue(name_queue)
        queue_messages = []
        while len(queue_messages) < banch_size:
            method_frame, header_frame, body = self.channel.basic_get(queue=name_queue)

            if method_frame:
                decoded_body = body.decode("utf-8")
                queue_messages.append(json.loads(decoded_body))

                self.channel.basic_ack(delivery_tag=method_frame.delivery_tag)

            elif len(queue_messages) != 0:
                continue
            else:
                break

        if queue_messages:
            return queue_messages
        else:
            return None


@celery.task(bind=True, base=AbortableTask)
def consume_flow_of_frames(self, job_id: str, stream_url: str):
    job = RedisManager().get_data(job_id)
    camera = RedisManager().get_data(job['camera_id'])

    max_retries = 99
    retries = 0

    fps_counter = 0
    area_cm2_list = []
    v_liters = []
    while retries < max_retries:
        try:
            cap = cv2.VideoCapture(stream_url)
            fps = int(cap.get(cv2.CAP_PROP_FPS))

            # ret, first_frame = cap.read()
            first_frame = cv2.imread(camera['img_name'])
            # cv2.imwrite('img.png', first_frame)
            min_flow_magnitude = 2.0

            lk_params = dict(
                winSize=(10, 10),
                maxLevel=1000,
                criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 10, 0.03),
            )
            feature_params = dict(
                maxCorners=200, qualityLevel=0.045, minDistance=7, blockSize=10
            )

            prev_gray = cv2.cvtColor(first_frame, cv2.COLOR_BGR2GRAY)
            prev_gray_tracking = cv2.adaptiveThreshold(
                prev_gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2
            )
            gpu_prev_gray = cv2.cuda_GpuMat()
            gpu_prev_gray_tracking = cv2.cuda_GpuMat()
            gpu_prev_gray.upload(prev_gray)
            gpu_prev_gray_tracking.upload(prev_gray_tracking)

            prev_points = cv2.goodFeaturesToTrack(prev_gray, mask=None, **feature_params)
            mask = np.zeros_like(first_frame)
            refresh_speed_counter = 0
            refresh_rate = 30

            try:
                roi_vertices = [(int(camera['detection']['A']['x']), int(camera['detection']['A']['y'])),
                                (int(camera['detection']['B']['x']), int(camera['detection']['B']['y'])),
                                (int(camera['detection']['C']['x']), int(camera['detection']['C']['y'])),
                                (int(camera['detection']['D']['x']), int(camera['detection']['D']['y'])), ]
            except:
                return

            frames = []

            logger.info("Running gets")
            rabbit_queue = RabbitQueue()
            while True:
                if self.is_aborted():
                    return
                status = RedisManager().get_data(job_id)
                if status['status']:
                    ret, frame = cap.read()
                    if len(frames) == 24:
                        results = process_stream(fps, frames, min_flow_magnitude, lk_params, prev_points, mask,
                                                 refresh_speed_counter, fps_counter, refresh_rate, roi_vertices,
                                                 gpu_prev_gray,
                                                 gpu_prev_gray_tracking, feature_params, area_cm2_list, v_liters,
                                                 camera['data']['volume'], camera['data']['sensitivity'],
                                                 camera['total_shlam_square'])

                        for result in results['results']:
                            content = {
                                job_id: result,
                                "job_id": job_id
                            }
                            # print(content)
                            rabbit_queue.add_message_queue(
                                f"{job_id}", f"{job_id}", content
                            )
                            time.sleep(1)
                        frames = []
                        fps_counter = results['fps_counter']
                        area_cm2_list = results['area_cm2_list']
                        v_liters = results['v_liters']
                    if not ret:
                        raise ("Connection refused streem")
                    frames.append(frame)

                else:
                    self.app.control.revoke(self.request.id, terminate=True)
                    return

        except Exception as e:
            retries += 1
            print(e)
            logger.error(f"Failed to connect to {job_id}")
            if retries < max_retries:
                logger.warning("Retrying connection in 1 seconds...")
                time.sleep(1)

            else:
                logger.error("Max connection retries reached. Exiting.")


def download_image(camera_id: str, image_url: str):
    response = requests.get(image_url.replace('http://90.150.90.185:8082', 'http://127.0.0.1:8082'))
    if response.status_code == 200:
        img_name = f'{camera_id}.png'
        with open(img_name, 'wb') as f:
            f.write(response.content)

        return img_name


@celery.task(bind=True, base=AbortableTask)
def test_calibration(self, calibration: dict):
    camera = RedisManager().get_data(calibration['camera_id'])
    img_name = download_image(calibration['camera_id'], camera['image_url'])
    max_retries = 99
    retries = 0

    camera['img_name'] = img_name
    camera['total_shlam_square'] = 0
    camera['id'] = calibration['camera_id']

    fps_counter = 0
    area_cm2_list = []
    v_liters = []
    while retries < max_retries:
        try:
            cap = cv2.VideoCapture(calibration['camera_url'])
            fps = int(cap.get(cv2.CAP_PROP_FPS))

            first_frame = cv2.imread(img_name)
            min_flow_magnitude = 2.0

            lk_params = dict(
                winSize=(10, 10),
                maxLevel=1000,
                criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 10, 0.03),
            )
            feature_params = dict(
                maxCorners=200, qualityLevel=0.045, minDistance=7, blockSize=10
            )

            prev_gray = cv2.cvtColor(first_frame, cv2.COLOR_BGR2GRAY)
            prev_gray_tracking = cv2.adaptiveThreshold(
                prev_gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2
            )
            gpu_prev_gray = cv2.cuda_GpuMat()
            gpu_prev_gray_tracking = cv2.cuda_GpuMat()
            gpu_prev_gray.upload(prev_gray)
            gpu_prev_gray_tracking.upload(prev_gray_tracking)

            prev_points = cv2.goodFeaturesToTrack(prev_gray, mask=None, **feature_params)
            mask = np.zeros_like(first_frame)
            refresh_speed_counter = 0
            refresh_rate = 30

            try:
                roi_vertices = [(int(calibration['detection']['A']['x']), int(calibration['detection']['A']['y'])),
                                (int(calibration['detection']['B']['x']), int(calibration['detection']['B']['y'])),
                                (int(calibration['detection']['C']['x']), int(calibration['detection']['C']['y'])),
                                (int(calibration['detection']['D']['x']), int(calibration['detection']['D']['y'])), ]
            except:
                return

            frames = []

            logger.info("Running gets")
            while True:
                if self.is_aborted():
                    return
                status = RedisManager().get_data(calibration['calibration_id'])
                if status['status'] == 'start':
                    ret, frame = cap.read()
                    if len(frames) == 24:
                        results = process_calibation(fps, frames, min_flow_magnitude, lk_params, prev_points, mask,
                                                     refresh_speed_counter, fps_counter, refresh_rate, roi_vertices,
                                                     gpu_prev_gray,
                                                     gpu_prev_gray_tracking, feature_params, area_cm2_list, v_liters)

                        for result in results['results']:
                            camera['total_shlam_square'] = result['total_shlam_square']

                        frames = []
                        fps_counter = results['fps_counter']
                        area_cm2_list = results['area_cm2_list']
                        v_liters = results['v_liters']
                    if not ret:
                        raise ("Connection refused streem")
                    frames.append(frame)

                else:
                    self.app.control.revoke(self.request.id, terminate=True)
                    RedisManager().add_data('camera', 'update', camera)
                    print('Записали данные по колибровке', camera)
                    return

        except Exception as e:
            retries += 1
            print(e)
            if retries < max_retries:
                logger.warning("Retrying connection in 1 seconds...")
                time.sleep(1)

            else:
                logger.error("Max connection retries reached. Exiting.")
