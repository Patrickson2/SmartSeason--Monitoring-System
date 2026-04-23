from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine
from app.models import User, Field, FieldUpdate
from app.routers import router

app = FastAPI(
    title="SmartSeason API",
    version="1.0.0",
    description="Agricultural Field Monitoring and Management System",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(router)


@app.get("/")
def root():
    return {"message": "SmartSeason API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
