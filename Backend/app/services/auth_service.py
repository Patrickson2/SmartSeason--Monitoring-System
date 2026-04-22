from sqlalchemy.orm import Session
from datetime import timedelta
import jwt

from app.database import get_db
from app.models.user import User
from app.config import settings
from app.routers.auth import pwd_context


class AuthService:
    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> User:
        user = db.query(User).filter(User.username == username).first()
        if not user:
            return None
        if not pwd_context.verify(password, user.hashed_password):
            return None
        return user

    @staticmethod
    def create_token(user_id: int) -> str:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        to_encode = {"sub": user_id, "exp": expire}
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
