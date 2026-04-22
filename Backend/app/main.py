from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine
from app.models import user, field
from app.routers import auth, fields, updates, users

user.Base.metadata.create_all(bind=engine)
field.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartSeason API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(fields.router, prefix="/api/fields", tags=["fields"])
app.include_router(updates.router, prefix="/api/updates", tags=["updates"])
app.include_router(users.router, prefix="/api/users", tags=["users"])


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
