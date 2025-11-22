"""
User management routes
"""
from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/health")
async def users_health():
    """Users service health check"""
    return {"status": "users service pending implementation"}
