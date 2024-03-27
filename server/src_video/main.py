import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src_video.routes import video
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="Geotime Video",
    description="Rtsp Stream video",
)
app.mount("/static", StaticFiles(directory="static"), name="static")

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
        host="127.0.0.1",
        port=8082,
        log_level='info',
    )
