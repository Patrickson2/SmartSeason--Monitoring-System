from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid

from app.database import get_db
from app.models.user import User, UserRole, ApprovalStatus
from app.schemas.auth import LoginRequest, LoginResponse, AgentRegistrationRequest, AgentResponse
from app.services.auth_service import verify_password, create_access_token, hash_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user with email and password.
    Returns access token and user role.
    """
    user = db.query(User).filter(User.email == request.email).first()

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="User account is inactive"
        )

    # Check approval status for agents
    if user.role == UserRole.AGENT and user.approval_status != ApprovalStatus.APPROVED:
        if user.approval_status == ApprovalStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account is pending approval from an administrator"
            )
        elif user.approval_status == ApprovalStatus.REJECTED:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account registration has been rejected"
            )

    access_token = create_access_token(str(user.id))

    return LoginResponse(access_token=access_token, user_role=user.role.value)


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
        id=str(uuid.uuid4()),
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

    return AgentResponse(
        id=agent.id,
        name=agent.name,
        email=agent.email,
        approval_status=agent.approval_status.value,
        fields_count=0
    )
