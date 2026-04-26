from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

import random
import json

from app.database import get_db
from app.models.user import User, UserRole
from app.models.field import Field
from app.models.field_update import FieldUpdate
from app.services.auth_service import get_current_user
from app.services.field_service import compute_field_status

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/analyze-field/{field_id}")
async def analyze_field_image(
    field_id: str,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Analyze field image using AI (mock implementation).
    Stores the analysis result in field_updates so admin can view it.
    Returns crop detection analysis with bounding boxes and health status.
    """
    # Validate field exists and user has access
    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Field not found"
        )

    # Check access permissions
    role_val = current_user.role.value if hasattr(current_user.role, 'value') else current_user.role
    if role_val == UserRole.AGENT.value and field.assigned_agent_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this field"
        )

    # Validate image file
    if not image.content_type.startswith('image/'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )

    # Mock AI analysis - simulate realistic crop detection
    total_crops = random.randint(25, 60)
    
    # Generate realistic distribution based on field status
    field_status = compute_field_status(field)
    if field_status == "active":
        healthy_ratio = random.uniform(0.7, 0.9)
        at_risk_ratio = random.uniform(0.1, 0.25)
        critical_ratio = 1 - healthy_ratio - at_risk_ratio
    elif field_status == "at_risk":
        healthy_ratio = random.uniform(0.4, 0.6)
        at_risk_ratio = random.uniform(0.25, 0.4)
        critical_ratio = 1 - healthy_ratio - at_risk_ratio
    else:  # completed
        healthy_ratio = random.uniform(0.8, 0.95)
        at_risk_ratio = random.uniform(0.05, 0.15)
        critical_ratio = random.uniform(0, 0.05)

    healthy = int(total_crops * healthy_ratio)
    at_risk = int(total_crops * at_risk_ratio)
    critical = total_crops - healthy - at_risk

    # Generate mock bounding boxes
    bounding_boxes = []
    for i in range(total_crops):
        # Random position and size
        x = random.uniform(5, 75)  # Keep within image bounds
        y = random.uniform(5, 75)
        width = random.uniform(8, 20)
        height = random.uniform(8, 20)
        
        # Assign status based on distribution
        if i < healthy:
            status = "healthy"
            confidence = random.uniform(0.85, 0.98)
        elif i < healthy + at_risk:
            status = "at_risk"
            confidence = random.uniform(0.75, 0.92)
        else:
            status = "critical"
            confidence = random.uniform(0.80, 0.95)
        
        bounding_boxes.append({
            "id": f"crop_{i}",
            "x": x,
            "y": y,
            "width": width,
            "height": height,
            "status": status,
            "confidence": confidence
        })

    # Generate AI recommendations based on analysis
    recommendations = []
    
    if critical > 0:
        recommendations.append({
            "priority": "high",
            "title": "Critical Crops Detected",
            "description": f"{critical} crops require immediate attention",
            "action": "Inspect and treat critical crops within 24 hours"
        })
    
    if at_risk > total_crops * 0.3:
        recommendations.append({
            "priority": "medium",
            "title": "High Risk Population",
            "description": f"{at_risk} crops showing stress indicators",
            "action": "Increase monitoring frequency"
        })
    
    # Add weather-based recommendation
    current_stage = field.current_stage.value if hasattr(field.current_stage, 'value') else field.current_stage
    if current_stage in ["growing", "ready"]:
        recommendations.append({
            "priority": "medium",
            "title": "Irrigation Advisory",
            "description": "Current conditions suggest irrigation needed",
            "action": "Consider watering in next 48 hours"
        })

    # Calculate overall confidence
    confidence_score = random.uniform(0.82, 0.96)

    analysis_result = {
        "analysis_id": f"analysis_{random.randint(1000, 9999)}",
        "field_id": field_id,
        "timestamp": "2026-04-24T12:00:00Z",
        "total_crops": total_crops,
        "healthy": healthy,
        "at_risk": at_risk,
        "critical": critical,
        "confidence_score": confidence_score,
        "bounding_boxes": bounding_boxes,
        "recommendations": recommendations,
        "field_conditions": {
            "overall_health": "good" if healthy / total_crops > 0.7 else "moderate" if healthy / total_crops > 0.5 else "poor",
            "growth_stage": current_stage,
            "estimated_yield": f"{random.randint(70, 95)}%",
            "next_action": "monitor" if field_status == "active" else "prepare_harvest" if current_stage == "ready" else "harvest_ready"
        }
    }

    # Save analysis to database as a field update
    # Store image as base64 or URL placeholder (for demo, store a reference)
    field_update = FieldUpdate(
        field_id=field_id,
        agent_id=current_user.id,
        observation=f"AI Analysis: {healthy} healthy, {at_risk} at risk, {critical} critical crops detected.",
        image_url=f"/api/ai/field-image/{field_id}/{analysis_result['analysis_id']}",
        analysis_data=json.dumps(analysis_result),
    )
    db.add(field_update)
    db.commit()

    return analysis_result


@router.get("/insights/{field_id}")
async def get_field_insights(
    field_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get AI-powered insights for a field including weather and harvest predictions.
    """
    # Validate field exists and user has access
    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Field not found"
        )

    # Check access permissions
    role_val = current_user.role.value if hasattr(current_user.role, 'value') else current_user.role
    if role_val == UserRole.AGENT.value and field.assigned_agent_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this field"
        )

    # Mock weather data
    weather_data = {
        "current": {
            "temperature": random.randint(18, 28),
            "humidity": random.randint(45, 75),
            "condition": random.choice(["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"]),
            "wind_speed": random.randint(5, 15)
        },
        "forecast": [
            {"day": "Tomorrow", "high": random.randint(22, 30), "low": random.randint(15, 20), "rain_chance": random.randint(0, 60)},
            {"day": "Day 2", "high": random.randint(20, 28), "low": random.randint(14, 19), "rain_chance": random.randint(10, 70)},
            {"day": "Day 3", "high": random.randint(21, 29), "low": random.randint(13, 18), "rain_chance": random.randint(5, 50)}
        ]
    }

    # Mock harvest prediction
    days_to_harvest = random.randint(15, 45)
    harvest_prediction = {
        "estimated_date": "2024-07-15",
        "days_to_harvest": days_to_harvest,
        "confidence": random.randint(75, 95),
        "factors": [
            {"name": "Current Growth Stage", "impact": "positive", "weight": 0.4},
            {"name": "Weather Forecast", "impact": "neutral", "weight": 0.3},
            {"name": "Historical Data", "impact": "positive", "weight": 0.3}
        ],
        "yield_estimate": f"{random.randint(65, 95)}%",
        "quality_score": random.randint(7, 10)
    }

    # Generate field-specific recommendations
    recommendations = []
    
    # Irrigation recommendations
    if weather_data["current"]["humidity"] < 50:
        recommendations.append({
            "type": "irrigation",
            "priority": "high" if weather_data["current"]["humidity"] < 40 else "medium",
            "title": "Irrigation Recommended",
            "description": f"Low humidity ({weather_data['current']['humidity']}%) suggests irrigation needed",
            "action": "Water within 24-48 hours"
        })
    
    # Harvest timing
    current_stage = field.current_stage.value if hasattr(field.current_stage, 'value') else field.current_stage
    if current_stage == "ready":
        recommendations.append({
            "type": "harvest",
            "priority": "medium",
            "title": "Harvest Preparation",
            "description": f"Crops ready for harvest in approximately {days_to_harvest} days",
            "action": "Prepare equipment and schedule harvest"
        })
    
    # General monitoring
    recommendations.append({
        "type": "monitoring",
        "priority": "low",
        "title": "Regular Monitoring",
        "description": "Continue routine field inspections",
        "action": "Schedule next drone flight in 3-4 days"
    })

    insights = {
        "field_id": field_id,
        "generated_at": "2026-04-24T12:00:00Z",
        "weather": weather_data,
        "harvest_prediction": harvest_prediction,
        "recommendations": recommendations,
        "field_health_score": random.randint(7, 10),
        "next_optimal_action": "irrigate" if weather_data["current"]["humidity"] < 50 else "monitor" if current_stage == "growing" else "prepare_harvest"
    }

    return insights


@router.get("/system-status")
async def get_ai_system_status(current_user: User = Depends(get_current_user)):
    """
    Get AI system status and capabilities (for dashboard display).
    """
    return {
        "status": "operational",
        "version": "1.0.0",
        "capabilities": [
            "Crop detection and counting",
            "Health status assessment", 
            "Growth stage analysis",
            "Weather integration",
            "Harvest prediction",
            "Irrigation recommendations"
        ],
        "processing_stats": {
            "images_processed_today": random.randint(15, 45),
            "crops_analyzed": random.randint(500, 1500),
            "accuracy_rate": f"{random.uniform(85, 96)}%",
            "average_processing_time": f"{random.uniform(2.5, 8.2)}s"
        },
        "last_update": "2026-04-24T11:30:00Z"
    }
