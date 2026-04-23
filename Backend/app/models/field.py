import uuid
import enum
from datetime import date, datetime
from typing import Optional
from sqlalchemy import Date, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class CropStage(str, enum.Enum):
    PLANTED = "planted"
    GROWING = "growing"
    READY = "ready"
    HARVESTED = "harvested"


class Field(Base):
    __tablename__ = "fields"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    crop_type: Mapped[str] = mapped_column(String(100), nullable=False)
    planting_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    current_stage: Mapped[CropStage] = mapped_column(
        Enum(CropStage), nullable=False, default=CropStage.PLANTED
    )
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    assigned_agent_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=True
    )
    created_by_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    assigned_agent = relationship(
        "User", back_populates="assigned_fields", foreign_keys=[assigned_agent_id]
    )
    created_by = relationship(
        "User", back_populates="created_fields", foreign_keys=[created_by_id]
    )
    updates = relationship(
        "FieldUpdate", back_populates="field", cascade="all, delete-orphan"
    )


# Export CropStage for easier imports
__all__ = ["Field", "CropStage"]
