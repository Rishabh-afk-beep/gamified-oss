from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.services.leaderboard_service import LeaderboardService

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("")
async def get_leaderboard(
    type: str = Query("all_time", description="weekly, monthly, or all_time"),
    limit: int = Query(50, description="Number of results"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get leaderboard"""
    try:
        service = LeaderboardService(db)
        leaderboard = await service.get_leaderboard(type=type, limit=limit)
        return leaderboard
    except Exception as e:
        return {"error": str(e)}

@router.get("/user/{user_id}")
async def get_user_rank(
    user_id: str,
    type: str = Query("all_time"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get specific user's rank"""
    try:
        service = LeaderboardService(db)
        rank = await service.get_user_rank(user_id, type=type)
        return rank
    except Exception as e:
        return {"error": str(e)}
