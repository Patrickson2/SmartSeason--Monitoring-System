"""Create users, fields, field_updates tables

Revision ID: 001_create_initial_tables
Revises:
Create Date: 2024-04-22 18:30:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by alembic.
revision: str = "001_create_initial_tables"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column(
            "role",
            sa.Enum("ADMIN", "AGENT", name="userrole"),
            nullable=False,
            server_default="AGENT",
        ),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")
        ),
    )
    op.create_index("ix_users_email", "users", ["email"])

    # Create fields table
    op.create_table(
        "fields",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("crop_type", sa.String(100), nullable=False),
        sa.Column("planting_date", sa.Date(), nullable=True),
        sa.Column(
            "current_stage",
            sa.Enum("PLANTED", "GROWING", "READY", "HARVESTED", name="cropstage"),
            nullable=False,
            server_default="PLANTED",
        ),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column(
            "assigned_agent_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=True,
        ),
        sa.Column(
            "created_by_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=False,
        ),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")
        ),
        sa.Column(
            "updated_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")
        ),
    )

    # Create field_updates table
    op.create_table(
        "field_updates",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "field_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("fields.id"),
            nullable=False,
        ),
        sa.Column(
            "agent_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=False,
        ),
        sa.Column(
            "stage_changed_to",
            sa.Enum("PLANTED", "GROWING", "READY", "HARVESTED", name="cropstage"),
            nullable=True,
        ),
        sa.Column("observation", sa.Text(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")
        ),
    )


def downgrade() -> None:
    op.drop_table("field_updates")
    op.drop_table("fields")
    op.drop_table("users")
