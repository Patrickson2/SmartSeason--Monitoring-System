from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.field import Field
from app.schemas.field import FieldUpdateResponse
from app.services.auth_service import get_current_user, require_admin, normalize_enum_value


def _normalize_id(value):
    return str(value) if value is not None else None

router = APIRouter(prefix="/fields", tags=["field-updates"])


@router.get("/updates/all", response_model=List[FieldUpdateResponse], dependencies=[Depends(require_admin)])
def get_all_updates(db: Session = Depends(get_db)):
    """
    Get all field updates across all fields.
    Admin only endpoint.
    """
    from app.models.field_update import FieldUpdate

    updates = (
        db.query(FieldUpdate)
        .order_by(FieldUpdate.created_at.desc())
        .all()
    )

    return [
        FieldUpdateResponse(
            id=_normalize_id(u.id),
            field_id=_normalize_id(u.field_id),
            agent_id=_normalize_id(u.agent_id),
            stage_changed_to=normalize_enum_value(u.stage_changed_to) if u.stage_changed_to else None,
            observation=u.observation,
            image_url=u.image_url,
            analysis_data=u.analysis_data,
            created_at=u.created_at,
        )
        for u in updates
    ]


@router.get("/{field_id}/updates", response_model=List[FieldUpdateResponse])
def get_field_updates(
    field_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get update history for a field.
    Agent can only view updates for fields assigned to them.
    """
    from app.models.field_update import FieldUpdate
    from app.models.user import UserRole
    from fastapi import HTTPException, status

    # Check field exists
    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Field not found"
        )

    # Agent can only view their assigned fields' updates
    role_val = normalize_enum_value(current_user.role)
    if role_val == UserRole.AGENT.value:
        if field.assigned_agent_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this field",
            )

    updates = (
        db.query(FieldUpdate)
        .filter(FieldUpdate.field_id == field_id)
        .order_by(FieldUpdate.created_at.desc())
        .all()
    )

    return [
        FieldUpdateResponse(
            id=_normalize_id(u.id),
            field_id=_normalize_id(u.field_id),
            agent_id=_normalize_id(u.agent_id),
            stage_changed_to=normalize_enum_value(u.stage_changed_to) if u.stage_changed_to else None,
            observation=u.observation,
            image_url=u.image_url,
            analysis_data=u.analysis_data,
            created_at=u.created_at,
        )
        for u in updates
    ]
