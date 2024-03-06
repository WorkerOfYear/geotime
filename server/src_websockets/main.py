import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src_websockets.routes import ws


app = FastAPI(
    title="Geotime Websockets",
    description="Rtsp Stream",
)

app.include_router(ws.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(
        'src_websockets.main:app',
        host="127.0.0.1",
        port=8081,
        log_level='info',
    )
