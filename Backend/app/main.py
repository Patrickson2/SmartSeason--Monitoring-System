import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, SessionLocal, Base
from app.models import User, UserRole, Field, FieldUpdate
from app.models.user import ApprovalStatus
from app.routers import router
from app.services.auth_service import hash_password


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: create tables and default admin on startup."""
    Base.metadata.create_all(bind=engine)

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

    yield


app = FastAPI(
    title="SmartSeason API",
    version="1.0.0",
    description="Agricultural Field Monitoring and Management System",
    lifespan=lifespan,
)

# CORS middleware
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://smart-season-monitoring-system-cqmh.vercel.app",
]
if settings.ALLOWED_ORIGINS:
    origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(router)


@app.get("/")
def root():
    return {"message": "SmartSeason API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
