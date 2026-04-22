from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.routers.auth import get_current_user as auth_get_current_user


def get_current_user(
    token: str = Depends(OAuth2PasswordBearer(tokenUrl="/api/auth/login")),
    db: Session = Depends(get_db),
) -> User:
    return auth_get_current_user(token, db)
