from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, Enum, ForeignKey, Integer, Text, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.field import CropStage


class FieldUpdate(Base):
    __tablename__ = "field_updates"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    field_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("fields.id"), nullable=False
    )
    agent_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    stage_changed_to: Mapped[Optional[CropStage]] = mapped_column(
        Enum(CropStage), nullable=True
    )
    observation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # AI analysis fields - stores drone image analysis results
    image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    analysis_data: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON string
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    # Relationships
    field = relationship("Field", back_populates="updates")
    agent = relationship("User", back_populates="field_updates")
