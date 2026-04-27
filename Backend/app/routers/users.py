from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List


from app.database import get_db
from app.models.user import User, UserRole, ApprovalStatus
from app.schemas.auth import AgentCreate, AgentResponse, AgentApprovalRequest
from app.services.auth_service import hash_password, get_current_user, require_admin

router = APIRouter(prefix="/users", tags=["users"])


def _normalize_id(value):
    """Convert integer IDs to string IDs for API responses."""
    return str(value) if value is not None else None


@router.post(
    "/agents", response_model=AgentResponse, dependencies=[Depends(require_admin)]
)
def create_agent(request: AgentCreate, db: Session = Depends(get_db)):
    """
    Create a new agent account. Role is always set to 'agent' by the system.
    Admin only endpoint.
    """
    # Check if email already exists
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        from fastapi import HTTPException, status

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Create agent with hashed password
    agent = User(
        name=request.name,
        email=request.email,
        hashed_password=hash_password(request.password),
        role=UserRole.AGENT,
        is_active=True,
        approval_status=ApprovalStatus.APPROVED,  # Admin-created agents are auto-approved
    )
    db.add(agent)
    db.commit()
    db.refresh(agent)

    approval_status = agent.approval_status.value if hasattr(agent.approval_status, 'value') else agent.approval_status
    return AgentResponse(
        id=_normalize_id(agent.id),
        name=agent.name,
        email=agent.email,
        approval_status=approval_status,
        fields_count=0,
    )


@router.get(
    "/agents", response_model=List[AgentResponse], dependencies=[Depends(require_admin)]
)
def list_agents(db: Session = Depends(get_db)):
    """
    List all agents with their id, name, email, approval status, and field count.
    Admin only endpoint.
    """
    agents = db.query(User).filter(User.role == UserRole.AGENT).all()

    result = []
    for agent in agents:
        # Count fields assigned to this agent
        fields_count = len(agent.assigned_fields) if agent.assigned_fields else 0
        approval_status = agent.approval_status.value if hasattr(agent.approval_status, 'value') else agent.approval_status
        result.append(
            AgentResponse(
                id=_normalize_id(agent.id),
                name=agent.name,
                email=agent.email,
                approval_status=approval_status,
                fields_count=fields_count,
            )
        )

    return result


@router.post(
    "/agents/{agent_id}/approve", dependencies=[Depends(require_admin)]
)
def approve_agent(agent_id: str, request: AgentApprovalRequest, db: Session = Depends(get_db)):
    """
    Approve or reject an agent registration request.
    Admin only endpoint.
    """
    agent = db.query(User).filter(User.id == agent_id, User.role == UserRole.AGENT).first()
    if not agent:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found"
        )

    if request.action == "approve":
        agent.approval_status = ApprovalStatus.APPROVED
    elif request.action == "reject":
        agent.approval_status = ApprovalStatus.REJECTED
    else:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid action. Must be 'approve' or 'reject'"
        )

    db.commit()

    return {"message": f"Agent {request.action}d successfully"}
