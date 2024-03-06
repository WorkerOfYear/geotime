from pydantic import BaseModel
from typing import Optional


class DefaultData(BaseModel):
    host: str
    port: str
    depth: str
    well_diam: str
    lag_depth: str


class Wits(BaseModel):
    data: DefaultData
