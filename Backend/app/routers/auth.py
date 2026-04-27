import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.user import User, UserRole, ApprovalStatus
from app.schemas.auth import LoginRequest, LoginResponse, AgentRegistrationRequest, AgentResponse
from app.services.auth_service import verify_password, create_access_token, hash_password, normalize_enum_value

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user with email and password.
    Returns access token and user role.
    """
    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        logger.warning(f"Login failed: user not found for email={request.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    is_valid = verify_password(request.password, user.hashed_password)
    if not is_valid:
        logger.warning(f"Login failed: invalid password for email={request.email}, user_id={user.id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="User account is inactive"
        )

    # Normalize enum values for SQLite compatibility
    user_role_val = normalize_enum_value(user.role)
    approval_status_val = normalize_enum_value(user.approval_status)

    # Check approval status for agents
    if user_role_val == UserRole.AGENT.value and approval_status_val != ApprovalStatus.APPROVED.value:
        if approval_status_val == ApprovalStatus.PENDING.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account is pending approval from an administrator"
            )
        elif approval_status_val == ApprovalStatus.REJECTED.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account registration has been rejected"
            )

    access_token = create_access_token(str(user.id))
    logger.info(f"Login success: email={request.email}, user_id={user.id}, role={user_role_val}")

    return LoginResponse(access_token=access_token, user_role=user_role_val)


@router.post("/register/agent", response_model=AgentResponse)
def register_agent(request: AgentRegistrationRequest, db: Session = Depends(get_db)):
    """
    Register a new agent account. Requires admin approval.
    """
    # Prevent using the admin email for public registration
    if request.email == settings.ADMIN_EMAIL:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email is reserved for the system administrator",
        )

    # Check if email already exists
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Create agent with pending approval
    agent = User(
        name=request.name,
        email=request.email,
        hashed_password=hash_password(request.password),
        role=UserRole.AGENT,
        is_active=True,
        approval_status=ApprovalStatus.PENDING,
    )
    db.add(agent)
    db.commit()
    db.refresh(agent)

    approval_status = agent.approval_status.value if hasattr(agent.approval_status, 'value') else agent.approval_status
    return AgentResponse(
        id=agent.id,
        name=agent.name,
        email=agent.email,
        approval_status=approval_status,
        fields_count=0
    )
