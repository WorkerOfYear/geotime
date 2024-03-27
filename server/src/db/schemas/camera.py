from pydantic import BaseModel
from typing import Optional, List


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
    type: List[str] = ['calibration', 'streaming']
    data: DefaultData
    detection: Detection


class GetWorkData(BaseModel):
    id: str


class Calibration(BaseModel):
    id: str
