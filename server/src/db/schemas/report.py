from pydantic import BaseModel
from fastapi import Query

from typing import Optional


class ReportSchema(BaseModel):
    date_from: Optional[str]
    date_to: Optional[str]
    page: int = Query(0, ge=0)
    limit: int = Query(20, le=20)


class SaveReportSchema(BaseModel):
    date_from: Optional[str]
    date_to: Optional[str]
