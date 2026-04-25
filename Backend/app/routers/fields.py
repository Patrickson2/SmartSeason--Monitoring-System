from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.user import User, UserRole
from app.models.field import Field, CropStage
from app.models.field_update import FieldUpdate
from app.schemas.field import (
    FieldCreate,
    FieldResponse,
    FieldStageUpdate,
    FieldUpdateCreate,
    FieldUpdateResponse,
    FieldWithHistoryResponse,
)
from app.services.field_service import compute_field_status
from app.services.auth_service import get_current_user, require_admin

router = APIRouter(prefix="/fields", tags=["fields"])


def _safe_enum_value(val):
    """Return enum value safely for both enum objects and SQLite strings."""
    return val.value if hasattr(val, 'value') else val


def field_to_response(field: Field) -> FieldResponse:
    """Convert Field model to response with computed status."""
    return FieldResponse(
        id=field.id,
        name=field.name,
        crop_type=field.crop_type,
        planting_date=field.planting_date,
        current_stage=_safe_enum_value(field.current_stage),
        notes=field.notes,
        assigned_agent_id=field.assigned_agent_id,
        created_by_id=field.created_by_id,
        created_at=field.created_at,
        updated_at=field.updated_at,
        status=compute_field_status(field),
    )


@router.get("", response_model=List[FieldResponse])
def list_fields(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List fields.
    - Admin sees all fields
    - Agent sees only their assigned fields
    """
    # Normalize role for SQLite compatibility
    role_val = current_user.role.value if hasattr(current_user.role, 'value') else current_user.role
    if role_val == UserRole.ADMIN.value:
        fields = db.query(Field).all()
    else:
        fields = (
            db.query(Field).filter(Field.assigned_agent_id == current_user.id).all()
        )

    return [field_to_response(f) for f in fields]


@router.post("", response_model=FieldResponse)
def create_field(
    request: FieldCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """
    Create a new field and optionally assign it to an agent.
    Admin only endpoint.
    """
    # Validate assigned agent exists if provided
    if request.assigned_agent_id:
        agent = (
            db.query(User)
            .filter(User.id == request.assigned_agent_id, User.role == UserRole.AGENT)
            .first()
        )
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Assigned agent not found",
            )

    field = Field(
        id=str(uuid.uuid4()),
        name=request.name,
        crop_type=request.crop_type,
        planting_date=request.planting_date,
        current_stage=CropStage.PLANTED,
        notes=request.notes,
        assigned_agent_id=request.assigned_agent_id,
        created_by_id=current_user.id,
    )
    db.add(field)
    db.commit()
    db.refresh(field)

    return field_to_response(field)


@router.get("/{field_id}", response_model=FieldResponse)
def get_field(
    field_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get a single field with its computed status.
    Admin can view any field, agent can only view assigned fields.
    """
    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Field not found"
        )

    # Agent can only view their assigned fields
    role_val = current_user.role.value if hasattr(current_user.role, 'value') else current_user.role
    if role_val == UserRole.AGENT.value:
        if field.assigned_agent_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this field",
            )

    return field_to_response(field)


@router.get(
    "/{field_id}/detail",
    response_model=FieldWithHistoryResponse,
    dependencies=[Depends(require_admin)],
)
def get_field_detail(field_id: str, db: Session = Depends(get_db)):
    """
    Get a single field with full update history.
    Admin only endpoint.
    """
    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Field not found"
        )

    updates = (
        db.query(FieldUpdate)
        .filter(FieldUpdate.field_id == field_id)
        .order_by(FieldUpdate.created_at.desc())
        .all()
    )

    return FieldWithHistoryResponse(
        id=field.id,
        name=field.name,
        crop_type=field.crop_type,
        planting_date=field.planting_date,
        current_stage=_safe_enum_value(field.current_stage),
        notes=field.notes,
        assigned_agent_id=field.assigned_agent_id,
        created_by_id=field.created_by_id,
        created_at=field.created_at,
        updated_at=field.updated_at,
        status=compute_field_status(field),
        updates=[
            FieldUpdateResponse(
                id=u.id,
                field_id=u.field_id,
                agent_id=u.agent_id,
                stage_changed_to=_safe_enum_value(u.stage_changed_to) if u.stage_changed_to else None,
                observation=u.observation,
                created_at=u.created_at,
            )
            for u in updates
        ],
    )


@router.patch("/{field_id}/stage", response_model=FieldResponse)
def update_field_stage(
    field_id: str,
    request: FieldStageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update the current stage of a field.
    Agent can only update fields assigned to them.
    """
    # Validate stage
    try:
        new_stage = CropStage(request.stage)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid stage. Must be one of: planted, growing, ready, harvested",
        )

    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Field not found"
        )

    # Agent can only update their assigned fields
    role_val = current_user.role.value if hasattr(current_user.role, 'value') else current_user.role
    if role_val == UserRole.AGENT.value:
        if field.assigned_agent_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this field",
            )

    old_stage = field.current_stage
    field.current_stage = new_stage
    db.commit()
    db.refresh(field)

    # Create field update record for history
    update = FieldUpdate(
        id=str(uuid.uuid4()),
        field_id=field.id,
        agent_id=current_user.id,
        stage_changed_to=new_stage,
    )
    db.add(update)
    db.commit()

    return field_to_response(field)


@router.patch("/{field_id}/assign", response_model=FieldResponse)
def assign_field_agent(
    field_id: str,
    request: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """
    Assign or unassign an agent to a field.
    Admin only endpoint.
    """
    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Field not found"
        )

    # Validate assigned agent exists if provided
    if "assigned_agent_id" in request and request["assigned_agent_id"]:
        agent = (
            db.query(User)
            .filter(User.id == request["assigned_agent_id"], User.role == UserRole.AGENT)
            .first()
        )
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Assigned agent not found",
            )

    field.assigned_agent_id = request.get("assigned_agent_id")
    db.commit()
    db.refresh(field)

    return field_to_response(field)


@router.post("/{field_id}/updates", response_model=FieldUpdateResponse)
def add_field_observation(
    field_id: str,
    request: FieldUpdateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Add an observation note to a field.
    Agent can only add observations to fields assigned to them.
    """
    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Field not found"
        )

    # Agent can only update their assigned fields
    role_val = current_user.role.value if hasattr(current_user.role, 'value') else current_user.role
    if role_val == UserRole.AGENT.value:
        if field.assigned_agent_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this field",
            )

    # Create field update record
    field_update = FieldUpdate(
        id=str(uuid.uuid4()),
        field_id=field.id,
        agent_id=current_user.id,
        stage_changed_to=request.stage_changed_to,
        observation=request.observation,
    )
    db.add(field_update)
    db.commit()
    db.refresh(field_update)

    return FieldUpdateResponse(
        id=field_update.id,
        field_id=field_update.field_id,
        agent_id=field_update.agent_id,
        stage_changed_to=_safe_enum_value(field_update.stage_changed_to)
        if field_update.stage_changed_to
        else None,
        observation=field_update.observation,
        created_at=field_update.created_at,
    )
