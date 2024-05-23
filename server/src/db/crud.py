from datetime import datetime

from loguru import logger
from sqlalchemy import func

from src.db.models import Report


def create_report(session, report: dict, job_id: str):
    logger.debug(report)
    if report:
        db_report = Report(
            job_id=job_id,
            depth=float(report["depth"]),
            cut_plan_volume=float(report["cut_plan_volume"]),
            lag_depth=float(report["lag_depth"]),
            well_diam=float(report["well_diam"]),
            cut_plan_volume_with_out_well=float(report["cut_plan_volume_with_out_well"]),
            cut_plan_volume_in_well=float(report["cut_plan_volume_in_well"]),
            сut_fact_volume_delta_1=float(report["сut_fact_volume_delta_1"]),
            сut_fact_volume_delta_2=float(report["сut_fact_volume_delta_2"]),
            сut_fact_volume_delta_3=float(report["сut_fact_volume_delta_3"]),
            cut_fact_volume_1=float(report["cut_fact_volume_1"]),
            cut_fact_volume_2=float(report["cut_fact_volume_2"]),
            cut_fact_volume_3=float(report["cut_fact_volume_3"]),
            cut_fact_volume=float(report["cut_fact_volume"]),
            cleaning_factor=float(report["cleaning_factor"]),
        )
        session.add(db_report)
        session.commit()
        logger.success(f"added data in report - {report}")


def get_reports(session, date_from: str = None, date_to: str = None, page: int = None, limit: int = None):
    query = session.query(Report)

    if date_from:
        date_from = datetime.strptime(date_from, '%Y.%m.%d,%H:%M')
        query = query.filter(Report.created_at >= date_from)

    if date_to:
        date_to = datetime.strptime(date_to, '%Y.%m.%d,%H:%M')
        query = query.filter(Report.created_at <= date_to)

    if page is not None and limit is not None:
        query = query.offset(page * limit).limit(limit)

    reports_obj = query.all()
    if reports_obj:
        return [
            {
                "depth": report.depth,
                "lag_depth": report.lag_depth,
                "well_diam": report.well_diam,
                "cut_plan_volume": report.cut_plan_volume,
                "cut_plan_volume_with_out_well": report.cut_plan_volume_with_out_well,
                "cut_plan_volume_in_well": report.cut_plan_volume_in_well,
                "сut_fact_volume_delta_1": report.сut_fact_volume_delta_1,
                "сut_fact_volume_delta_2": report.сut_fact_volume_delta_2,
                "сut_fact_volume_delta_3": report.сut_fact_volume_delta_3,
                "cut_fact_volume_1": report.cut_fact_volume_1,
                "cut_fact_volume_2": report.cut_fact_volume_2,
                "cut_fact_volume_3": report.cut_fact_volume_3,
                "cut_fact_volume": report.cut_fact_volume,
                "cleaning_factor": report.cleaning_factor,
                "created_at": str(report.created_at)
            }
            for report in reports_obj
        ]
    return []


def get_count_pages_reports(session, limit: int = 20):
    total_records = session.query(func.count()).select_from(Report).scalar()
    return (total_records + limit - 1) // limit
