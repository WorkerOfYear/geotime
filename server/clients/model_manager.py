from loguru import logger

from src.utils.calculates import predict_data, result_process_data
from helpers.rqueue import RabbitQueue


class ModelManager:
    def process_frames_by_cv(self):
        rabbit_queue = RabbitQueue()

        while True:
            queues = ['camera1', 'camera2', 'camera3']
            for queue in queues:
                chunks = {queue: rabbit_queue.check_banch_msg(queue)}

                parametrs = {}
                empty_chank = False
                for queue, chunk in chunks.items():
                    if chunk:
                        content = {
                            queue: predict_data(chunk),
                            "job_id": queue
                        }
                        parametrs.update(content)
                    else:
                        empty_chank = True

                if not empty_chank:
                    logger.debug(f"Parametrs: {parametrs}")
                    rabbit_queue.add_message_queue(
                        "result_cameras", "result_cameras", parametrs
                    )
