from fastapi import APIRouter

from src.db.schemas.job import JobSchema
from clients.job_manager import JobManager
from fastapi.responses import JSONResponse
from  helpers.async_rqueue import AsyncRabbitQueue

router = APIRouter(
    tags=["Job"],
    prefix="/job",
)


@router.post("/change_status", status_code=200)
async def start_job(job: JobSchema):
    jm = JobManager()
    jobs = jm.create_new_jobs(job)

    rabbit_queue = AsyncRabbitQueue()
    await rabbit_queue.initialize()
    await rabbit_queue.purge_queues(["camera1", "camera2", "camera3"])

    return JSONResponse(status_code=200, content=jobs)
