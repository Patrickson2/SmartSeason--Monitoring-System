import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import settings
from app.database import engine, SessionLocal, Base
from app.models import User, UserRole, Field, FieldUpdate
from app.models.user import ApprovalStatus
from app.routers import router
from app.services.auth_service import hash_password

logger = logging.getLogger(__name__)


def _safe_role_value(role):
    """Return role string safely for both enum objects and SQLite strings."""
    return role.value if hasattr(role, 'value') else role


def _build_cors_origins():
    """Build CORS allow-origins list from settings and hardcoded defaults."""
    origins = {
        "https://smart-season-monitoring-system-cqmh.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174",
    }
    if settings.ALLOWED_ORIGINS:
        for origin in settings.ALLOWED_ORIGINS.split(","):
            origin = origin.strip()
            if origin:
                origins.add(origin)
    return list(origins)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: create tables and default admin on startup."""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created/verified.")
    except Exception as e:
        logger.error(f"Failed to create tables: {e}")

    db = SessionLocal()
    try:
        # Check if admin exists (handle SQLite string vs enum safely)
        all_users = db.query(User).all()
        existing_admin = None
        for u in all_users:
            role_str = _safe_role_value(u.role)
            if role_str == UserRole.ADMIN.value:
                existing_admin = u
                break

        if not existing_admin:
            logger.info("No admin found. Creating default admin...")
            admin = User(
                name=settings.ADMIN_NAME,
                email=settings.ADMIN_EMAIL,
                hashed_password=hash_password(settings.ADMIN_PASSWORD),
                role=UserRole.ADMIN,
                is_active=True,
                approval_status=ApprovalStatus.APPROVED,
            )
            db.add(admin)
            db.commit()
            logger.info(f"Default admin created: {settings.ADMIN_EMAIL}")
        else:
            logger.info(f"Default admin already exists: {existing_admin.email}")
    except Exception as e:
        logger.error(f"CRITICAL: Failed to create default admin: {e}")
        db.rollback()
        raise RuntimeError(f"Admin creation failed: {e}") from e
    finally:
        db.close()

    # Auto-seed demo data if no agents exist yet
    try:
        from seed import seed_demo_data
        db = SessionLocal()
        agent_count = db.query(User).filter(User.role == UserRole.AGENT).count()
        db.close()
        if agent_count == 0:
            logger.info("No agents found. Auto-seeding demo data...")
            seed_demo_data()
        else:
            logger.info(f"Found {agent_count} agents - skipping auto-seed.")
    except Exception as e:
        logger.warning(f"Auto-seeding skipped: {e}")

    yield


app = FastAPI(
    title="SmartSeason API",
    version="1.0.0",
    description="Agricultural Field Monitoring and Management System",
    lifespan=lifespan,
)

# CORS middleware - allow frontend origin and localhost for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=_build_cors_origins(),
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
    """Health check that also verifies database connectivity."""
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}


@app.get("/setup-status")
def setup_status():
    """Check if the default admin user exists."""
    try:
        db = SessionLocal()
        admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
        db.close()
        if admin:
            return {
                "admin_exists": True,
                "admin_email": admin.email,
                "admin_name": admin.name,
            }
        return {"admin_exists": False}
    except Exception as e:
        return {"admin_exists": False, "error": str(e)}
