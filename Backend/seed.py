#!/usr/bin/env python3
"""
SmartSeason Database Seeder
============================
Run this script to populate your database with randomized demo data.
Usage:
    cd Backend
    python seed.py
"""
import sys
import random
from datetime import datetime, timedelta
from app.database import SessionLocal, engine, Base
from app.models import User, UserRole, Field, FieldUpdate, CropStage, ApprovalStatus
from app.services.auth_service import hash_password


# Demo data pools
FIRST_NAMES = [
    "John", "Sarah", "Michael", "Emily", "David", "Jessica", "Robert", "Laura",
    "James", "Emma", "William", "Olivia", "Daniel", "Sophia", "Matthew", "Ava",
    "Joseph", "Mia", "Andrew", "Isabella", "Ryan", "Charlotte", "Chris", "Amelia"
]

LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White"
]

CROP_TYPES = [
    "Wheat", "Corn", "Rice", "Soybeans", "Barley", "Oats", "Potatoes",
    "Tomatoes", "Cotton", "Sugarcane", "Coffee", "Tea", "Cocoa",
    "Bananas", "Apples", "Grapes", "Olives", "Sunflowers", "Canola"
]

FIELD_ADJECTIVES = [
    "Green", "Sunny", "Golden", "River", "Hill", "Valley", "Oak", "Pine",
    "Meadow", "Spring", "Autumn", "North", "South", "East", "West",
    "Highland", "Lowland", "Breezy", "Fertile", "Rich"
]

FIELD_NOUNS = [
    "Fields", "Farm", "Acres", "Pastures", "Plantation", "Orchard",
    "Vineyard", "Ranch", "Homestead", "Grove", "Gardens", "Meadows"
]

OBSERVATIONS = [
    "Plants showing good growth progress",
    "Slight yellowing observed on eastern section",
    "Irrigation system working efficiently",
    "Pest activity detected in quadrant 3",
    "Soil moisture levels optimal",
    "Weeds present along fence line",
    "Drone survey completed - all clear",
    "Fertilizer applied successfully",
    "Signs of drought stress in some areas",
    "Crop height uniform across field",
    "Minor fungal spots on lower leaves",
    "Harvest readiness at 75%",
    "New shoots emerging well",
    "Wind damage minimal this week",
    "Beneficial insects observed",
    "pH levels within acceptable range",
    "Root development looking strong",
    "Flowering stage beginning",
    "Fruit set looking promising",
    "Color development progressing nicely"
]


def random_date(start_days_ago=90, end_days_ago=1):
    """Generate a random date within range."""
    days = random.randint(end_days_ago, start_days_ago)
    return datetime.utcnow() - timedelta(days=days)


def random_name():
    """Generate a random full name."""
    return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"


def random_field_name():
    """Generate a random field name."""
    return f"{random.choice(FIELD_ADJECTIVES)} {random.choice(FIELD_NOUNS)}"


def create_seed_data():
    """Create demo data in the database."""
    db = SessionLocal()
    
    print(" SmartSeason Database Seeder")
    print("=" * 40)
    
    try:
        # Clear existing data (optional - keep admin)
        print("\n1. Cleaning existing demo data...")
        db.query(FieldUpdate).delete()
        db.query(Field).delete()
        # Keep admin, delete other users
        db.query(User).filter(User.role == UserRole.AGENT).delete()
        db.commit()
        
        # Get admin id
        admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
        admin_id = admin.id if admin else None
        
        # Create agents
        print("\n2. Creating agents...")
        agents = []
        for i in range(5):
            agent = User(
                name=random_name(),
                email=f"agent{i+1}@smartseason.demo",
                hashed_password=hash_password("password123"),
                role=UserRole.AGENT,
                is_active=True,
                approval_status=ApprovalStatus.APPROVED,
                created_at=random_date(60, 30)
            )
            agents.append(agent)
            db.add(agent)
        db.commit()
        print(f"    Created {len(agents)} agents")
        for a in agents:
            print(f"      - {a.name} ({a.email})")
        
        # Create fields
        print("\n3. Creating fields...")
        fields = []
        stages = [CropStage.PLANTED, CropStage.GROWING, CropStage.READY, CropStage.HARVESTED]
        stage_weights = [0.2, 0.4, 0.3, 0.1]  # Most in growing/ready
        
        for i in range(12):
            stage = random.choices(stages, weights=stage_weights)[0]
            planting_date = (datetime.utcnow() - timedelta(days=random.randint(30, 180))).date()
            
            field = Field(
                name=random_field_name(),
                crop_type=random.choice(CROP_TYPES),
                planting_date=planting_date,
                current_stage=stage,
                notes=random.choice(OBSERVATIONS) if random.random() > 0.5 else None,
                assigned_agent_id=random.choice(agents).id if random.random() > 0.2 else None,
                created_by_id=admin_id,
                created_at=random_date(60, 10),
                updated_at=random_date(30, 1)
            )
            fields.append(field)
            db.add(field)
        db.commit()
        print(f"    Created {len(fields)} fields")
        for f in fields:
            agent_str = f.assigned_agent_id if f.assigned_agent_id else "Unassigned"
            print(f"      - {f.name} ({f.crop_type}) - {f.current_stage.value} - Agent: {agent_str}")
        
        # Create field updates/history
        print("\n4. Creating field update history...")
        updates_count = 0
        for field in fields:
            # Each field gets 0-5 updates
            num_updates = random.randint(0, 5)
            for j in range(num_updates):
                update = FieldUpdate(
                    field_id=field.id,
                    agent_id=field.assigned_agent_id if field.assigned_agent_id else random.choice(agents).id,
                    stage_changed_to=random.choice(stages) if random.random() > 0.5 else None,
                    observation=random.choice(OBSERVATIONS),
                    created_at=random_date(30, 1)
                )
                db.add(update)
                updates_count += 1
        db.commit()
        print(f"    Created {updates_count} field updates")
        
        # Create some AI analysis entries
        print("\n5. Creating AI analysis records...")
        ai_count = 0
        for field in random.sample(fields, min(6, len(fields))):
            analysis = FieldUpdate(
                field_id=field.id,
                agent_id=field.assigned_agent_id if field.assigned_agent_id else random.choice(agents).id,
                observation="AI Analysis: Drone image processed successfully",
                image_url=f"/api/ai/field-image/{field.id}/demo-analysis",
                analysis_data='{"total_crops": 42, "healthy": 35, "at_risk": 5, "critical": 2, "confidence_score": 0.91}',
                created_at=random_date(14, 2)
            )
            db.add(analysis)
            ai_count += 1
        db.commit()
        print(f"   ✓ Created {ai_count} AI analysis records")
        
        print("\n" + "=" * 40)
        print(" Demo data seeded successfully!")
        print("\nLogin credentials:")
        print("   Admin:    admin@smartseason.com  /  (your admin password)")
        print("   Agents:   agent1@smartseason.demo  /  password123")
        print("             agent2@smartseason.demo  /  password123")
        print("             ... up to agent5")
        print("\nYou can now run the backend and explore the system!")
        
    except Exception as e:
        db.rollback()
        print(f"\n Error: {e}")
        raise
    finally:
        db.close()


def seed_demo_data():
    """Entry point for auto-seeding from main.py lifespan."""
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    # Check if admin exists
    db = SessionLocal()
    admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
    db.close()
    
    if not admin:
        print("  No admin found! Skipping seed - run backend first.")
        return False
    
    create_seed_data()
    return True


if __name__ == "__main__":
    seed_demo_data()
