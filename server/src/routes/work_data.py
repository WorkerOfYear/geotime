import uuid
from fastapi import APIRouter
from fastapi.responses import JSONResponse

from src.db.schemas.camera import Camera, GetWorkData, Calibration
from src.db.schemas.wits import Wits
from clients.redis_manager import RedisManager
from src.tasks.tasks import test_calibration

router = APIRouter(
    tags=["Work Data"],
    prefix="/work_data",
)


@router.post("/camera", status_code=200)
async def add_work_data_camera(camera: Camera):
    if camera.type[0] == "streaming":
        if camera.id is None:
            camera_id = RedisManager().add_data('camera', 'add', camera.dict())
            return JSONResponse(status_code=200, content={"id": camera_id})
        else:
            last_data = RedisManager().get_data(camera.dict()['id'])
            final_data = camera.dict()
            final_data['img_name'] = last_data['img_name']
            final_data['total_shlam_square'] = last_data['total_shlam_square']

            print(final_data)
            RedisManager().add_data('camera', 'update', final_data)
            return JSONResponse(status_code=200, content=True)
    if camera.type[0] == "calibration":
        camera_info = camera.dict()
        camera_info['id'] = ''
        RedisManager().add_data('camera', 'update', camera_info)
        
        calibration_id = str(uuid.uuid4())
        data = {
            'calibration_id': calibration_id,
            'status': 'start',
            'camera_id': camera.id,
            'camera_url': camera.data.url,
            'detection': camera.detection.dict()
        }
        RedisManager().add_data('calib', 'add', data)
        test_calibration.delay(data)
        return JSONResponse(status_code=200, content={
            'calibration_id': calibration_id
        })


@router.post("/stop_detection", status_code=200)
async def add_work_data_wits(calib: Calibration):
    calibration = RedisManager().get_data(calib.id)
    calibration['status'] = 'stop'
    RedisManager().add_data('calib', 'add', calibration)
    return JSONResponse(status_code=200, content=True)


@router.post("/wits", status_code=200)
async def add_work_data_wits(wits: Wits):
    print(wits.dict())
    wits_id = RedisManager().add_data('wits', 'add', wits.dict())
    return JSONResponse(status_code=200, content={"id": wits_id})


@router.post("/get_data", status_code=200)
async def get_work_data(work_data: GetWorkData):
    work_data = RedisManager().get_data(work_data.dict()['id'])
    return JSONResponse(status_code=200, content=work_data)
