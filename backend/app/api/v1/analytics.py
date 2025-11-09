from fastapi import APIRouter, Depends, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.core.security import verify_token
from typing import Optional
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/me")
async def get_user_analytics(
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get user analytics"""
    if not authorization:
        return {"error": "Not authenticated"}
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        return {"error": "Invalid token"}
    
    try:
        service = AnalyticsService(db)
        analytics = await service.get_user_analytics(user_id)
        return analytics
    except Exception as e:
        return {"error": str(e)}

@router.get("/me/progress")
async def get_user_progress(
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get user progress over time"""
    if not authorization:
        return {"error": "Not authenticated"}
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        return {"error": "Invalid token"}
    
    try:
        service = AnalyticsService(db)
        progress = await service.get_progress_data(user_id)
        return progress
    except Exception as e:
        return {"error": str(e)}
