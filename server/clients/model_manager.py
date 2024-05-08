import os
import cv2
import json
import time
import numpy as np
from cv2 import cuda
import matplotlib.pyplot as plt
from typing import List, Dict, Any

from loguru import logger

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
                    print("huy")
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
    h_estimated_cm = volume / total_shlam_square * 1000

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
                    print("huy")
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


class ModelManager:
    def process_video(self, stream_url, job_id):
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
                first_frame = cv2.imread('img.png')
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

                roi_vertices = [(80, 308), (25, 598), (1073, 594), (991, 272)]

                frames = []

                while True:
                    if self.is_aborted():
                        return

                    ret, frame = cap.read()
                    if len(frames) == 24:
                        results = process_stream(fps, frames, min_flow_magnitude, lk_params, prev_points, mask,
                                                 refresh_speed_counter, fps_counter, refresh_rate, roi_vertices,
                                                 gpu_prev_gray,
                                                 gpu_prev_gray_tracking, feature_params, area_cm2_list, v_liters)

                        for result in results['results']:
                            content = {
                                job_id: result,
                                "job_id": job_id
                            }
                            print(content)
                        frames = []
                        fps_counter = results['fps_counter']
                        area_cm2_list = results['area_cm2_list']
                        v_liters = results['v_liters']
                    if not ret:
                        raise ("Connection refused streem")
                    frames.append(frame)

            except Exception as e:
                retries += 1
                print(e)
                logger.error(f"Failed to connect to {job_id}")
                if retries < max_retries:
                    logger.warning("Retrying connection in 1 seconds...")
                    time.sleep(1)

                else:
                    logger.error("Max connection retries reached. Exiting.")

    def start_process(self, job_id: str, stream_url: str):
        max_retries = 5
        retries = 0

        while retries < max_retries:
            try:
                cap = cv2.VideoCapture(stream_url)
                frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                fps = int(cap.get(cv2.CAP_PROP_FPS))
                codec_info = cap.get(cv2.CAP_PROP_FOURCC)
                codec_fourcc = int(codec_info).to_bytes(4, byteorder="little").decode("utf-8")

                cap.setExceptionMode(True)

                if not cap.isOpened():
                    raise Exception("Cap closed")

                # rabbit_queue = RabbitQueue()
                logger.success(f"Connection with {job_id} established")

                while cap.isOpened():
                    frames = []
                    if self.is_aborted():
                        return

                    status = RedisManager().get_data(job_id)
                    if status['status']:
                        ret, frame = cap.read()
                        if len(frames) > 24:
                            content = {
                                job_id: process_stream(frame_width, frame_height, fps, codec_info, codec_fourcc,
                                                       frames),
                                "job_id": job_id
                            }

                            print(content)
                            frames = []

                            rabbit_queue.add_message_queue(
                                "result_cameras", "result_cameras", content
                            )

                        frames.append(frame)

                    else:
                        self.app.control.revoke(self.request.id, terminate=True)
                        return

                cap.release()
                logger.info(f"consume_flow_of_frames of {job_id} disconnected")

            except Exception:
                retries += 1
                logger.error(f"Failed to connect to {job_id}")
                if retries < max_retries:
                    logger.warning("Retrying connection in 1 seconds...")
                    time.sleep(1)

                else:
                    logger.error("Max connection retries reached. Exiting.")
                    raise


if __name__ == "__main__":
    manager = ModelManager()
    manager.start_process("camera1", "rtsp://127.0.0.1:8554/")
