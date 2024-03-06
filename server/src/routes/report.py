from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse, FileResponse

from src.db.schemas.report import ReportSchema, SaveReportSchema
from src.db.database import Session
from src.db.crud import get_reports, get_count_pages_reports
from src.utils.saver import Saver

router = APIRouter(
    tags=["Report"],
    prefix="/report",
)


def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()


@router.post("/get", status_code=200)
async def get_report(item: ReportSchema, db: Session = Depends(get_db)):
    report = get_reports(db, item.date_from, item.date_to, item.page, item.limit)
    return JSONResponse(status_code=200, content=report)


@router.post("/save", status_code=200)
async def save_report(item: SaveReportSchema, db: Session = Depends(get_db)):
    report = get_reports(db, item.date_from, item.date_to)
    file_path = Saver().save_excel(report)
    return FileResponse(file_path, filename="report.xlsx")


@router.get("/get_count_pages", status_code=200)
async def get_count_pages(db: Session = Depends(get_db)):
    count_pages = get_count_pages_reports(db)
    return JSONResponse(status_code=200, content={"count_pages": count_pages})
