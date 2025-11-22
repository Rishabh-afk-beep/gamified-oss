from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.utils.level_system import get_level_from_xp, get_xp_progress
from datetime import datetime, timedelta
from bson import ObjectId

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/me")
async def get_user_analytics(
    user_id: str = "demo_user"
):
    """Get user analytics dashboard data (in-memory version)"""
    try:
        # Use analytics service without database for now
        from app.services.analytics_service import AnalyticsService
        analytics_service = AnalyticsService()
        
        analytics_data = await analytics_service.get_user_analytics(user_id)
        print(f"📊 Analytics for {user_id}: {analytics_data['total_xp']} XP, Level {analytics_data['level']}")
        
        return analytics_data
        
    except Exception as e:
        print(f"❌ Error in analytics: {e}")
        return {"error": str(e)}


@router.get("/me/progress")
async def get_progress_data(
    db: AsyncIOMotorDatabase = Depends(get_db),
    user_id: str = "demo_user"
):
    """Get user progress over last 30 days"""
    try:
        user = await db["users"].find_one({"username": user_id})
        
        if not user:
            return []
        
        progress_data = []
        
        # Generate last 30 days of data
        for i in range(30):
            date = datetime.utcnow() - timedelta(days=30 - i)
            
            # Mock progress data (in real app, this would come from history)
            total_xp_on_date = user.get("total_xp", 0) - (30 - i) * 100
            total_xp_on_date = max(0, total_xp_on_date)
            
            progress_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "xp": total_xp_on_date,
                "quests": max(0, (total_xp_on_date // 100)),
                "level": get_level_from_xp(total_xp_on_date)
            })
        
        return progress_data
    except Exception as e:
        return {"error": str(e)}


@router.get("/leaderboard/monthly")
async def get_monthly_leaderboard(
    db: AsyncIOMotorDatabase = Depends(get_db),
    limit: int = 50
):
    """Get leaderboard for this month"""
    try:
        # Get all users
        users = await db["users"].find().sort("total_xp", -1).limit(limit).to_list(limit)
        
        leaderboard = []
        for idx, user in enumerate(users):
            leaderboard.append({
                "rank": idx + 1,
                "username": user.get("username"),
                "level": get_level_from_xp(user.get("total_xp", 0)),
                "total_xp": user.get("total_xp", 0),
                "current_streak": user.get("current_streak", 0)
            })
        
        return leaderboard
    except Exception as e:
        return {"error": str(e)}
