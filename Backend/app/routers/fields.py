from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.field import Field
from app.schemas.field import FieldCreate, FieldUpdate, FieldResponse
from app.routers.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=FieldResponse)
def create_field(
    field: FieldCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_field = Field(**field.model_dump(), owner_id=current_user.id)
    db.add(db_field)
    db.commit()
    db.refresh(db_field)
    return db_field


@router.get("/", response_model=List[FieldResponse])
def read_fields(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    fields = (
        db.query(Field)
        .filter(Field.owner_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return fields


@router.get("/{field_id}", response_model=FieldResponse)
def read_field(
    field_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    return field


@router.put("/{field_id}", response_model=FieldResponse)
def update_field(
    field_id: int,
    field_update: FieldUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    for key, value in field_update.model_dump(exclude_unset=True).items():
        setattr(field, key, value)
    db.commit()
    db.refresh(field)
    return field


@router.delete("/{field_id}")
def delete_field(
    field_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    db.delete(field)
    db.commit()
    return {"detail": "Field deleted"}
