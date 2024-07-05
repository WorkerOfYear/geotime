import uvicorn
import os

from loguru import logger
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src_video.routes import video
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="Geotime Video",
    description="Rtsp Stream video",
)

current_dir = os.path.dirname(__file__)
# app.mount("/static", StaticFiles(directory="app/static"), name="static")
static_url = os.path.join(current_dir, 'static')
app.mount('/static', StaticFiles(directory=static_url), name='static')

app.include_router(video.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(
        'src_video.main:app',
        host="0.0.0.0",
        port=8082,
        log_level='info',
    )
