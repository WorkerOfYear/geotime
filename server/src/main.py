import asyncio

import uvicorn

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.db.models import Base
from src.db.database import engine

from src.routes import report, work_data, job


async def create_data() -> None:
    Base.metadata.create_all(engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_data()
    yield


app = FastAPI(
    title="Geotime",
    description="Rtsp Stream",
    lifespan=lifespan,
)

app.include_router(job.router)
app.include_router(report.router)
app.include_router(work_data.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(
        'src.main:app',
        host="0.0.0.0",
        port=8080,
        log_level='info',
    )
