from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.auth import AgentCreate, AgentResponse
from app.services.auth_service import hash_password, get_current_user, require_admin

router = APIRouter(prefix="/users", tags=["users"])


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
        id=uuid.uuid4(),
        name=request.name,
        email=request.email,
        hashed_password=hash_password(request.password),
        role=UserRole.AGENT,
        is_active=True,
    )
    db.add(agent)
    db.commit()
    db.refresh(agent)

    return AgentResponse(
        id=agent.id, name=agent.name, email=agent.email, fields_count=0
    )


@router.get(
    "/agents", response_model=List[AgentResponse], dependencies=[Depends(require_admin)]
)
def list_agents(db: Session = Depends(get_db)):
    """
    List all agents with their id, name, email, and field count.
    Admin only endpoint.
    """
    agents = db.query(User).filter(User.role == UserRole.AGENT).all()

    result = []
    for agent in agents:
        # Count fields assigned to this agent
        fields_count = len(agent.assigned_fields) if agent.assigned_fields else 0
        result.append(
            AgentResponse(
                id=agent.id,
                name=agent.name,
                email=agent.email,
                fields_count=fields_count,
            )
        )

    return result
