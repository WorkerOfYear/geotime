from fastapi import APIRouter
from fastapi.responses import JSONResponse

from src.db.schemas.camera import Camera, GetWorkData
from src.db.schemas.wits import Wits
from clients.redis_manager import RedisManager

router = APIRouter(
    tags=["Work Data"],
    prefix="/work_data",
)


@router.post("/camera", status_code=200)
async def add_work_data_camera(camera: Camera):
    if camera.id is None:
        camera_id = RedisManager().add_data('camera', 'add', camera.dict())
        return JSONResponse(status_code=200, content={"id": camera_id})
    else:
        RedisManager().add_data('camera', 'update', camera.dict())
        return JSONResponse(status_code=200, content=True)


@router.post("/wits", status_code=200)
async def add_work_data_wits(wits: Wits):
    wits_id = RedisManager().add_data('wits', 'add', wits.dict())
    return JSONResponse(status_code=200, content={"id": wits_id})


@router.post("/get_data", status_code=200)
async def get_work_data(work_data: GetWorkData):
    work_data = RedisManager().get_data(work_data.dict()['id'])
    return JSONResponse(status_code=200, content=work_data)
