import uuid

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, SessionLocal
from app.models import User, UserRole, Field, FieldUpdate
from app.models.user import ApprovalStatus
from app.routers import router
from app.services.auth_service import hash_password

app = FastAPI(
    title="SmartSeason API",
    version="1.0.0",
    description="Agricultural Field Monitoring and Management System",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_origin_regex=r"http://localhost(:[0-9]+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(router)


@app.on_event("startup")
def create_default_admin():
    db = SessionLocal()
    try:
        existing_admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
        if not existing_admin:
            admin = User(
                id=str(uuid.uuid4()),
                name=settings.ADMIN_NAME,
                email=settings.ADMIN_EMAIL,
                hashed_password=hash_password(settings.ADMIN_PASSWORD),
                role=UserRole.ADMIN,
                is_active=True,
                approval_status=ApprovalStatus.APPROVED,
            )
            db.add(admin)
            db.commit()
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "SmartSeason API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
