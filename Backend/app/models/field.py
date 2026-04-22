from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Float,
    Enum,
    Text,
)
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base


class FieldStatus(str, enum.Enum):
    ACTIVE = "active"
    FALLOW = "fallow"
    PLANTED = "planted"
    HARVESTED = "harvested"


class CropStage(str, enum.Enum):
    GERMINATION = "germination"
    VEGETATIVE = "vegetative"
    FLOWERING = "flowering"
    FRUITING = "fruiting"
    MATURE = "mature"


class Field(Base):
    __tablename__ = "fields"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String)
    area_hectares = Column(Float)
    soil_type = Column(String)
    crop_type = Column(String)
    planting_date = Column(DateTime)
    expected_harvest_date = Column(DateTime)
    status = Column(String, enum=FieldStatus, default=FieldStatus.ACTIVE)
    current_stage = Column(String, enum=CropStage, default=CropStage.GERMINATION)
    notes = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="fields")
    updates = relationship("FieldUpdate", back_populates="field")


class FieldUpdate(Base):
    __tablename__ = "field_updates"

    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("fields.id"))
    stage = Column(String, enum=CropStage)
    status = Column(String, enum=FieldStatus)
    notes = Column(Text)
    image_url = Column(String)
    reported_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    field = relationship("Field", back_populates="updates")
