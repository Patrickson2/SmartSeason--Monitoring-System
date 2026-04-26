from app.database import SessionLocal, engine, Base
from app.models import User, UserRole, ApprovalStatus
from app.services.auth_service import hash_password
from app.config import settings

# Create tables
Base.metadata.create_all(bind=engine)

# Create admin
db = SessionLocal()
admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
if not admin:
    admin = User(
        name=settings.ADMIN_NAME or 'SmartSeason Admin',
        email=settings.ADMIN_EMAIL or 'admin@smartseason.com',
        hashed_password=hash_password(settings.ADMIN_PASSWORD or 'admin123'),
        role=UserRole.ADMIN,
        is_active=True,
        approval_status=ApprovalStatus.APPROVED
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    print('Admin created with ID:', admin.id)
else:
    print('Admin already exists with ID:', admin.id)

db.close()
