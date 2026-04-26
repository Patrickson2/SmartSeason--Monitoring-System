from pydantic import BaseModel, Field as PydanticField
from typing import Optional, List
from datetime import date, datetime
import uuid


class FieldCreate(BaseModel):
    name: str
    crop_type: str
    planting_date: Optional[date] = None
    assigned_agent_id: Optional[str] = None
    notes: Optional[str] = None


class FieldUpdate(BaseModel):
    name: Optional[str] = None
    crop_type: Optional[str] = None
    planting_date: Optional[date] = None
    assigned_agent_id: Optional[str] = None
    notes: Optional[str] = None


class FieldStageUpdate(BaseModel):
    stage: str  # Will be validated in the router


class FieldResponse(BaseModel):
    id: str
    name: str
    crop_type: str
    planting_date: Optional[date]
    current_stage: str
    notes: Optional[str]
    assigned_agent_id: Optional[str]
    created_by_id: str
    created_at: datetime
    updated_at: datetime
    status: str  # Computed at read time

    model_config = {"from_attributes": True}


class FieldUpdateCreate(BaseModel):
    stage_changed_to: Optional[str] = None
    observation: Optional[str] = None


class FieldUpdateResponse(BaseModel):
    id: str
    field_id: str
    agent_id: str
    stage_changed_to: Optional[str]
    observation: Optional[str]
    image_url: Optional[str] = None
    analysis_data: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class FieldWithHistoryResponse(FieldResponse):
    updates: List[FieldUpdateResponse] = []
