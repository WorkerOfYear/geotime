from __future__ import annotations

import json
import time
import aio_pika as apika
import asyncio

from loguru import logger
from typing import Optional
from aio_pika.abc import AbstractIncomingMessage

from src.config.config import RabbitConfig

class AsyncRabbitQueue:
    def __init__(self) -> None:
        self.connection: apika.Connection = None
        self.channel: apika.Channel = None

    async def initialize(self):
        max_retries = 5
        retries = 0
        
        while retries < max_retries:
            try:
                self.connection = await apika.connect(host=RabbitConfig.host)
                self.channel = await self.connection.channel()
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
    
    async def start_connection_queue(self, name_queue: str) -> apika.abc.AbstractQueue:
        return await self.channel.declare_queue(name=name_queue)

    async def stop_connection_queue(self) -> None:
        await self.connection.close()

    async def add_message_queue(self, name_queue: str, key: str, message_queue: any) -> None:
        await self.start_connection_queue(name_queue)

        if isinstance(message_queue, (list, dict)):
            message_queue = json.dumps(message_queue)

        await self.channel.default_exchange.publish(message=apika.Message(body=message_queue.encode()), routing_key=key)

    async def get_single_message(self, name_queue: str) -> Optional[dict]:
        queue = await self.start_connection_queue(name_queue)
        incoming_message: Optional[AbstractIncomingMessage] = await queue.get(
            timeout=1, fail=False
        )
        if incoming_message:
            await incoming_message.ack()
            return json.loads(incoming_message.body.decode())

    async def check_queue(self, name_queue: str) -> list[dict] | None:
        queue = await self.start_connection_queue(name_queue)
        queue_messages = []

        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                if message:
                    yield json.loads(message.body.decode())