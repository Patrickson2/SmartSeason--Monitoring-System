from pydantic import BaseModel, EmailStr, Field as PydanticField
from typing import Optional
from datetime import date, datetime
import uuid


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_role: str

    model_config = {"from_attributes": True}


class AgentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class AgentResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    fields_count: int = 0

    model_config = {"from_attributes": True}
