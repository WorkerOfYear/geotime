import cv2
import json
import time

from celery import Celery, group
from celery.utils.log import get_task_logger
from celery.contrib.abortable import AbortableTask
from loguru import logger

from helpers.rqueue import RabbitQueue
from clients.redis_manager import RedisManager
from src.config.config import RedisConfig

celery = Celery(
    "tasks", broker=f"redis://{RedisConfig.host}:{RedisConfig.port}", backend=f"redis://{RedisConfig.host}:{RedisConfig.port}"
)
celery_log = get_task_logger(__name__)


@celery.task(bind=True, base=AbortableTask)
def consume_flow_of_frames(self, job_id: str, stream_url: str):
    max_retries = 5
    retries = 0

    while retries < max_retries:
        try:
            cap = cv2.VideoCapture(stream_url)
            cap.setExceptionMode(True)

            if not cap.isOpened():
                raise Exception("Cap closed")

            rabbit_queue = RabbitQueue()
            rabbit_queue.start_connection_queue(job_id)
            channel = rabbit_queue.channel
            logger.success(f"Connection with {job_id} established")

            while cap.isOpened():
                if self.is_aborted():
                    return
                status = RedisManager().get_data(job_id)
                if status['status']:
                    ret, frame = cap.read()
                    if ret:
                        channel.basic_publish(
                            exchange="",
                            routing_key=job_id,
                            body=json.dumps(frame.tolist()),
                        )
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
