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


# @router.websocket("/data")
# async def websocket_camera_data(websocket: WebSocket):
#     await websocket.accept()
#     try:
#         rabbit_queue = AsyncRabbitQueue()
#         await rabbit_queue.initialize()
#
#         cameras_dict = {}
#         prev_data = None
#         async for message in rabbit_queue.check_queue(f"camera1"):
#             if websocket.client_state != WebSocketState.CONNECTED:
#                 break  # Exit the loop if websocket is not connected
#
#             if message:
#                 job_id: str = message["job_id"]
#                 cameras_dict[job_id] = message[job_id]
#
#                 wits_data = WitsClient().get_data('last')
#                 current_data = [wits_data, cameras_dict]
#                 logger.debug(current_data)
#                 res_data = result_process_data(prev_data, current_data)
#                 res_data['job_id'] = message['job_id']
#                 prev_data = res_data
#
#                 # json_file = open(f"result_camera_{camera_id}.json", "w")
#                 # json.dump(res_data, json_file, indent=6)
#                 await websocket.send_json(res_data)
#
#     except WebSocketDisconnect:
#         logger.info("WebSocket disconnect")


# @router.websocket("/data")
# async def websocket_camera_data(camera1: bool, camera2: bool, camera3: bool, websocket: WebSocket):
#     await websocket.accept()
#     try:
#         rabbit_queue = AsyncRabbitQueue()
#         await rabbit_queue.initialize()
#
#         cameras_dict = {}
#         prev_data = None
#         while websocket.client_state == WebSocketState.CONNECTED:
#
#             if camera1:
#                 message1 = await rabbit_queue.get_single_message(f"camera1")
#                 if message1:
#                     logger.debug(f'New message from camera1 {message1}')
#                     job_id: str = message1["job_id"]
#                     cameras_dict[job_id] = message1[job_id]
#
#             if camera2:
#                 message2 = await rabbit_queue.get_single_message(f"camera2")
#                 if message2:
#                     logger.debug(f'New message from camera2 {message2}')
#                     job_id: str = message2["job_id"]
#                     cameras_dict[job_id] = message2[job_id]
#
#             if camera3:
#                 message3 = await rabbit_queue.get_single_message(f"camera3")
#                 if message3:
#                     logger.debug(f'New message from camera3: {message3}')
#                     job_id: str = message3["job_id"]
#                     cameras_dict[job_id] = message3[job_id]
#
#             wits_data = WitsClient().get_data('last')
#             current_data = [wits_data, cameras_dict]
#             logger.debug(current_data)
#             res_data = result_process_data(prev_data, current_data)
#             res_data['job_id'] = "res_data"
#             prev_data = res_data
#
#             await websocket.send_json(res_data)
#
#     except WebSocketDisconnect:
#         logger.info("WebSocket disconnect")


# @router.websocket("/res_data")
# async def websocket_res_data(websocket: WebSocket):
#     await websocket.accept()
#     try:
#         rabbit_queue = AsyncRabbitQueue()
#         await rabbit_queue.initialize()
#
#         file_names = ['result_camera_1.json', 'result_camera_2.json', 'result_camera_3.json']
#         var_names = ["camera_1", "camera_2", "camera_3"]
#         saved_data = {}
#         prev_data = None
        # while True:
            # if websocket.client_state != WebSocketState.CONNECTED:
            #     break  # Exit the loop if websocket is not connected
            #
            # for index, file_name in enumerate(file_names):
            #     with open(file_name, mode='a+') as file:
            #         file.seek(0)
            #         try:
            #             current_data = json.loads(file.read())
            #         except json.JSONDecodeError:
            #             current_data = None
            #
            #         if current_data:
            #             var_name = var_names[index]
            #             saved_data[var_name] = current_data
            #
            # wits_data = WitsClient().get_data('last')
            # current_data = [wits_data, saved_data]
            # logger.debug(current_data)
            # res_data = result_process_data(prev_data, current_data)
            # res_data['job_id'] = "res"
            # prev_data = res_data
            #
            # await rabbit_queue.add_message_queue("report", "report", json.dumps(res_data))
            # await websocket.send_json(res_data)
    #         logger.debug("res_data websocket")
    #         await asyncio.sleep(1)
    #
    # except WebSocketDisconnect:
    #     logger.info("WebSocket disconnect")
