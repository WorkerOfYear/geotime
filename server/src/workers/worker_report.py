import json

from loguru import logger

from helpers.rqueue import RabbitQueue
from src.db.crud import create_report
from src.db.database import session


class RabbitCallback(RabbitQueue):
    @staticmethod
    def callback(ch, method, properties, body) -> None:
        message = body.decode("utf-8")
        decode_message = json.loads(message)
        create_report(session, decode_message, decode_message['job_id'])

    def fetch_messages(self, name_queue: str) -> None:
        self.channel.queue_declare(queue=name_queue)
        self.channel.basic_consume(queue=name_queue, on_message_callback=self.callback, auto_ack=True)

        logger.info("Waiting messages")
        self.channel.start_consuming()


if __name__ == "__main__":
    queue = RabbitCallback()
    queue.fetch_messages("report")
