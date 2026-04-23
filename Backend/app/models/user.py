import uuid
import enum
from datetime import datetime
from sqlalchemy import Boolean, DateTime, Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    AGENT = "agent"


class ApprovalStatus(str, enum.Enum):
    APPROVED = "approved"
    PENDING = "pending"
    REJECTED = "rejected"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True
    )
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole), nullable=False, default=UserRole.AGENT
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    approval_status: Mapped[str] = mapped_column(
        Enum(ApprovalStatus), nullable=False, default=ApprovalStatus.APPROVED
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    # Relationships
    assigned_fields = relationship(
        "Field", back_populates="assigned_agent", foreign_keys="Field.assigned_agent_id"
    )
    created_fields = relationship(
        "Field", back_populates="created_by", foreign_keys="Field.created_by_id"
    )
    field_updates = relationship("FieldUpdate", back_populates="agent")
