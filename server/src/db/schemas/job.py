from pydantic import BaseModel


class JobSchema(BaseModel):
    camera1_is_active: bool
    camera1_id: str

    camera2_is_active: bool
    camera2_id: str

    camera3_is_active: bool
    camera3_id: str