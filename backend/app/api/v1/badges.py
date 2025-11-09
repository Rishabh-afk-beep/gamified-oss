from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.services.badge_service import BadgeService

router = APIRouter(prefix="/badges", tags=["badges"])

@router.get("")
async def get_all_badges(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all badges"""
    try:
        service = BadgeService(db)
        badges = await service.get_all_badges()
        return badges
    except Exception as e:
        return {"error": str(e)}

@router.get("/{badge_id}")
async def get_badge(badge_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get badge details"""
    try:
        service = BadgeService(db)
        badge = await service.get_badge_by_id(badge_id)
        return badge
    except Exception as e:
        return {"error": str(e)}
