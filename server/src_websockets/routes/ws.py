import asyncio
import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from starlette.websockets import WebSocketState
from loguru import logger

from helpers.async_rqueue import AsyncRabbitQueue
from clients.wits_manager import WitsClient
from src.utils.calculates import result_process_data

router = APIRouter(
    tags=["StreamingData"],
)


@router.websocket("/wits_data")
async def websocket_wits_feed(websocket: WebSocket):
    await websocket.accept()
    try:
        rabbit_queue = AsyncRabbitQueue()
        await rabbit_queue.initialize()
        async for message in rabbit_queue.check_queue('wits'):
            if websocket.client_state != WebSocketState.CONNECTED:
                break  # Exit the loop if websocket is not connected

            if message:
                await websocket.send_json(message)

    except WebSocketDisconnect:
        logger.info("Wits disconnected")


@router.websocket("/data")
async def websocket_data(websocket: WebSocket):
    await websocket.accept()
    try:
        rabbit_queue = AsyncRabbitQueue()
        await rabbit_queue.initialize()

        cameras_dict = {}
        prev_data = None
        async for message in rabbit_queue.check_queue("result_cameras"):
            if websocket.client_state != WebSocketState.CONNECTED:
                break  # Exit the loop if websocket is not connected

            if message:
                camera_id: str = message["job_id"]
                cameras_dict[camera_id] = message[camera_id]
                logger.info(cameras_dict)
                wits_data = WitsClient().get_data('last')
                current_data = [wits_data, cameras_dict]
                res_data = result_process_data(prev_data, current_data)
                res_data['job_id'] = message['job_id']
                prev_data = res_data

                await rabbit_queue.add_message_queue("report", "report", json.dumps(res_data))
                await websocket.send_json(res_data)

    except WebSocketDisconnect:
        logger.info("WebSocket disconnect")
