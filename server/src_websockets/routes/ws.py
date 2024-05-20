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
async def websocket_camera_data(camera1: bool, camera2: bool, camera3: bool, websocket: WebSocket):
    await websocket.accept()
    try:
        rabbit_queue = AsyncRabbitQueue()
        await rabbit_queue.initialize()

        cameras_dict = {}
        prev_data = None
        while websocket.client_state == WebSocketState.CONNECTED:

            if camera1:
                message1 = await rabbit_queue.get_single_message(f"camera1")
                if message1:
                    job_id: str = message1["job_id"]
                    cameras_dict[job_id] = message1[job_id]

            if camera2:
                message2 = await rabbit_queue.get_single_message(f"camera2")
                if message2:
                    job_id: str = message2["job_id"]
                    cameras_dict[job_id] = message2[job_id]

            if camera3:
                message3 = await rabbit_queue.get_single_message(f"camera3")
                if message3:
                    job_id: str = message3["job_id"]
                    cameras_dict[job_id] = message3[job_id]

            wits_data = WitsClient().get_data('last')
            current_data = [wits_data, cameras_dict]
            logger.debug(current_data)
            res_data = result_process_data(prev_data, current_data)
            res_data['job_id'] = "res_data"
            prev_data = res_data

            await rabbit_queue.add_message_queue("report", "report", json.dumps(res_data))
            await websocket.send_json(res_data)

    except WebSocketDisconnect:
        logger.info("WebSocket disconnect")
