from sqlalchemy.orm import Session
from typing import List, Optional

from app.models.field import Field, FieldUpdate
from app.schemas.field import FieldCreate, FieldUpdate as FieldUpdateSchema


class FieldService:
    @staticmethod
    def get_fields(
        db: Session, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Field]:
        return (
            db.query(Field)
            .filter(Field.owner_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_field(db: Session, field_id: int) -> Optional[Field]:
        return db.query(Field).filter(Field.id == field_id).first()

    @staticmethod
    def create_field(db: Session, field_data: FieldCreate, user_id: int) -> Field:
        field = Field(**field_data.model_dump(), owner_id=user_id)
        db.add(field)
        db.commit()
        db.refresh(field)
        return field

    @staticmethod
    def update_field(
        db: Session, field_id: int, field_data: FieldUpdateSchema
    ) -> Optional[Field]:
        field = db.query(Field).filter(Field.id == field_id).first()
        if not field:
            return None
        for key, value in field_data.model_dump(exclude_unset=True).items():
            setattr(field, key, value)
        db.commit()
        db.refresh(field)
        return field

    @staticmethod
    def delete_field(db: Session, field_id: int) -> bool:
        field = db.query(Field).filter(Field.id == field_id).first()
        if not field:
            return False
        db.delete(field)
        db.commit()
        return True

    @staticmethod
    def add_update(
        db: Session, field_id: int, update_data: FieldUpdateSchema, user_id: int
    ) -> FieldUpdate:
        update = FieldUpdate(
            **update_data.model_dump(), field_id=field_id, reported_by=user_id
        )
        db.add(update)
        db.commit()
        db.refresh(update)
        return update
