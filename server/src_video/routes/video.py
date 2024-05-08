import cv2
import uuid
import tempfile
import os

from fastapi import Request

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from loguru import logger

from clients.camera import CameraClient
from clients.seg_client import process_stream
from clients.redis_manager import RedisManager

router = APIRouter(
    tags=["StreamingVideo"],
)


@router.get("/stream")
async def video_feed(camera_url: str):
    try:
        camera_cli = CameraClient(rtsp_url=camera_url)

        return StreamingResponse(
            camera_cli.stream_video(),
            media_type="multipart/x-mixed-replace; boundary=frame",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/stream_detection")
async def video_feed(camera_url: str):
    try:

        return StreamingResponse(
            process_stream(camera_url),
            media_type="multipart/x-mixed-replace; boundary=frame",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/first_img")
async def video_feed(request: Request, camera_url: str):
    cap = cv2.VideoCapture(camera_url)
    ret, first_frame = cap.read()

    static_dir = "static"
    image_path = os.path.join(static_dir, 'camera_url_img.png')
    cv2.imwrite(image_path, first_frame)

    camera_id = str(uuid.uuid4())
    result = {
        "camera_id": camera_id,
        "image_url": f"{request.base_url}{image_path}",
    }
    RedisManager().add_data('camers', 'add', result)
    return result
