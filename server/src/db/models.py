import uuid

from sqlalchemy import Column, Float, String, DateTime, UUID
from datetime import datetime
from sqlalchemy.orm import declarative_base, Session
from sqlalchemy.orm import sessionmaker
from src.db.database import Base


class BaseModel(Base):
    __abstract__ = True

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    created_at = Column(DateTime, default=datetime.now())


class Report(BaseModel):
    __tablename__ = "report"

    job_id = Column(String)
    depth = Column(Float, nullable=True)
    lag_depth = Column(Float, nullable=True)
    well_diam = Column(Float, nullable=True)
    cut_plan_volume = Column(Float, nullable=True)
    cut_plan_volume_with_out_well = Column(Float, nullable=True)
    cut_plan_volume_in_well = Column(Float, nullable=True)
    cut_fact_volume_1 = Column(Float, nullable=True)
    cut_fact_volume_2 = Column(Float, nullable=True)
    cut_fact_volume_3 = Column(Float, nullable=True)
    cut_fact_volume = Column(Float, nullable=True)
    cleaning_factor = Column(Float, nullable=True)
