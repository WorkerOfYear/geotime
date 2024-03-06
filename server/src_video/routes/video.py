from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from loguru import logger

from clients.camera import CameraClient

router = APIRouter(
    tags=["StreamingVideo"],
)


@router.get("/stream")
async def video_feed(camera_url: str):
    """
    Стриминг видео с камер
    """
    try:
        camera_cli = CameraClient(rtsp_url=camera_url)

        return StreamingResponse(
            camera_cli.stream_video(),
            media_type="multipart/x-mixed-replace; boundary=frame",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Internal Server Error")


