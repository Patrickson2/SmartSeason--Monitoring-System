from pydantic import BaseModel, Field as PydanticField
from typing import Optional, List
from datetime import date, datetime
import uuid


class FieldCreate(BaseModel):
    name: str
    crop_type: str
    planting_date: Optional[date] = None
    assigned_agent_id: Optional[uuid.UUID] = None
    notes: Optional[str] = None


class FieldUpdate(BaseModel):
    name: Optional[str] = None
    crop_type: Optional[str] = None
    planting_date: Optional[date] = None
    assigned_agent_id: Optional[uuid.UUID] = None
    notes: Optional[str] = None


class FieldStageUpdate(BaseModel):
    stage: str  # Will be validated in the router


class FieldResponse(BaseModel):
    id: uuid.UUID
    name: str
    crop_type: str
    planting_date: Optional[date]
    current_stage: str
    notes: Optional[str]
    assigned_agent_id: Optional[uuid.UUID]
    created_by_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    status: str  # Computed at read time

    model_config = {"from_attributes": True}


class FieldWithHistoryResponse(FieldResponse):
    updates: List["FieldUpdateResponse"] = []


class FieldUpdateCreate(BaseModel):
    stage_changed_to: Optional[str] = None
    observation: Optional[str] = None


class FieldUpdateResponse(BaseModel):
    id: uuid.UUID
    field_id: uuid.UUID
    agent_id: uuid.UUID
    stage_changed_to: Optional[str]
    observation: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}"