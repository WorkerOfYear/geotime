FROM python:3.10-slim

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

RUN pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi


COPY src /app/src
COPY src_video /app/src_video
COPY src_websockets /app/src_websockets
COPY src/workers/worker_predict.py /app
COPY src/workers/worker_wits.py /app
COPY src/workers/worker_report.py /app