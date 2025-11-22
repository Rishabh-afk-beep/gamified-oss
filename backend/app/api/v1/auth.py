"""
Authentication routes
"""
from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/health")
async def auth_health():
    """Auth service health check"""
    return {"status": "auth service pending implementation"}
