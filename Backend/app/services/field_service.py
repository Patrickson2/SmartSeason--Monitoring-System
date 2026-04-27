from datetime import date
from typing import Literal
from app.models.field import Field


StatusResult = Literal["completed", "at_risk", "active"]


def _normalize_stage(stage):
    """Normalize stage to string value (handles enum objects and strings)."""
    if stage is None:
        return None
    if hasattr(stage, "value"):
        return stage.value
    if isinstance(stage, str):
        return stage.lower()
    return str(stage).lower()


def compute_field_status(field: Field) -> StatusResult:
    """
    Compute field status dynamically based on crop stage and time since planting.

    Logic:
    - harvested -> completed
    - planted + >14 days since planting -> at_risk
    - growing + >60 days since planting -> at_risk
    - ready + >21 days since planting -> at_risk
    - otherwise -> active
    """
    # Normalize current_stage to string for SQLite compatibility
    current_stage = _normalize_stage(field.current_stage)

    # Harvested fields are completed
    if current_stage == "harvested":
        return "completed"

    # Get today's date for calculation
    today = date.today()

    # Calculate days since planting
    if field.planting_date:
        days_since_planting = (today - field.planting_date).days
    else:
        days_since_planting = 0

    # Check at_risk conditions based on stage and time
    if current_stage == "planted" and days_since_planting > 14:
        return "at_risk"

    if current_stage == "growing" and days_since_planting > 60:
        return "at_risk"

    if current_stage == "ready" and days_since_planting > 21:
        return "at_risk"

    return "active"
