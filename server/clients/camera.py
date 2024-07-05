import cv2
from loguru import logger


class CameraClient:
    def __init__(self, rtsp_url, resolution=None):
        self.rtsp_url = rtsp_url
        self.resolution = [452, 230]

    async def stream_video(self):
        cap = cv2.VideoCapture(self.rtsp_url)

        if not cap.isOpened():
            logger.error("Failed to connect to camera")
            raise Exception()

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                logger.warning("Не удалось получить фрейм. Выход...")
                break

            frame = cv2.resize(frame, self.resolution)
            _, buffer = cv2.imencode(".jpg", frame)
            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n"
            )

        cap.release()
