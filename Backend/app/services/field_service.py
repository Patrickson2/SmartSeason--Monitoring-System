from datetime import date
from typing import Literal
from app.models.field import Field


StatusResult = Literal["completed", "at_risk", "active"]


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
    from app.models.field import CropStage

    # Harvested fields are completed
    if field.current_stage == CropStage.HARVESTED:
        return "completed"

    # Get today's date for calculation
    today = date.today()

    # Calculate days since planting
    if field.planting_date:
        days_since_planting = (today - field.planting_date).days
    else:
        days_since_planting = 0

    # Check at_risk conditions based on stage and time
    if field.current_stage == CropStage.PLANTED and days_since_planting > 14:
        return "at_risk"

    if field.current_stage == CropStage.GROWING and days_since_planting > 60:
        return "at_risk"

    if field.current_stage == CropStage.READY and days_since_planting > 21:
        return "at_risk"

    return "active"
