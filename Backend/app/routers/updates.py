from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.field import Field, FieldUpdate
from app.schemas.field import FieldUpdateCreate, FieldUpdateResponse
from app.routers.auth import get_current_user

router = APIRouter()


@router.post("/{field_id}/updates", response_model=FieldUpdateResponse)
def create_field_update(
    field_id: int,
    update: FieldUpdateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    db_update = FieldUpdate(
        **update.model_dump(),
        field_id=field_id,
        reported_by=current_user.id,
    )
    db.add(db_update)
    if update.stage:
        field.current_stage = update.stage
    if update.status:
        field.status = update.status
    db.commit()
    db.refresh(db_update)
    return db_update


@router.get("/{field_id}/updates", response_model=List[FieldUpdateResponse])
def read_field_updates(
    field_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updates = db.query(FieldUpdate).filter(FieldUpdate.field_id == field_id).all()
    return updates
