"""Add approval_status column to users table

Revision ID: 002_add_approval_status_to_users
Revises: 001_create_initial_tables
Create Date: 2026-04-23 12:45:00.000000
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "002_add_approval_status_to_users"
down_revision = "001_create_initial_tables"
branch_labels = None
dependencies = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "approval_status",
            sa.Enum("approved", "pending", "rejected", name="approvalstatus"),
            nullable=False,
            server_default="approved",
        ),
    )


def downgrade() -> None:
    op.drop_column("users", "approval_status")
    sa.Enum(name="approvalstatus").drop(op.get_bind(), checkfirst=False)
