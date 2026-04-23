from pydantic import BaseModel, EmailStr, Field as PydanticField
from typing import Optional
from datetime import date, datetime
import uuid


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    model_config = {"extra": "ignore"}


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_role: str

    model_config = {"from_attributes": True}


class AgentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class AgentRegistrationRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

    model_config = {"extra": "ignore"}


class AgentResponse(BaseModel):
    id: str
    name: str
    email: str
    approval_status: str
    fields_count: int = 0

    model_config = {"from_attributes": True}


class AgentApprovalRequest(BaseModel):
    agent_id: str
    action: str  # "approve" or "reject"
