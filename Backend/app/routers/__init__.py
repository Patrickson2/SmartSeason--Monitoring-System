from fastapi import APIRouter
from app.routers import auth, users, fields, updates

router = APIRouter(prefix="/api")

router.include_router(auth.router)
router.include_router(users.router)
router.include_router(fields.router)
router.include_router(updates.router)
