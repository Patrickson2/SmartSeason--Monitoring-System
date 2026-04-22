from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FieldBase(BaseModel):
    name: str
    location: Optional[str] = None
    area_hectares: Optional[float] = None
    soil_type: Optional[str] = None
    crop_type: Optional[str] = None


class FieldCreate(FieldBase):
    planting_date: Optional[datetime] = None
    expected_harvest_date: Optional[datetime] = None


class FieldUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    area_hectares: Optional[float] = None
    soil_type: Optional[str] = None
    crop_type: Optional[str] = None
    planting_date: Optional[datetime] = None
    expected_harvest_date: Optional[datetime] = None
    status: Optional[str] = None
    current_stage: Optional[str] = None
    notes: Optional[str] = None


class FieldResponse(FieldBase):
    id: int
    status: str
    current_stage: str
    notes: Optional[str]
    owner_id: int
    planting_date: Optional[datetime]
    expected_harvest_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FieldUpdateCreate(BaseModel):
    stage: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    image_url: Optional[str] = None


class FieldUpdateResponse(BaseModel):
    id: int
    field_id: int
    stage: Optional[str]
    status: Optional[str]
    notes: Optional[str]
    image_url: Optional[str]
    reported_by: int
    created_at: datetime

    class Config:
        from_attributes = True
