from pydantic import BaseModel
from typing import Optional


class DetectionItem(BaseModel):
    x: str
    y: str


class Detection(BaseModel):
    A: DetectionItem
    B: DetectionItem
    C: DetectionItem
    D: DetectionItem


class DefaultData(BaseModel):
    url: str
    volume: str
    sensitivity: str


class Camera(BaseModel):
    id: Optional[str] = None
    data: DefaultData
    detection: Detection


class GetWorkData(BaseModel):
    id: str
