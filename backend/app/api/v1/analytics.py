from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.utils.level_system import get_level_from_xp, get_xp_progress
from datetime import datetime, timedelta
from bson import ObjectId

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/me")
async def get_user_analytics(
    db: AsyncIOMotorDatabase = Depends(get_db),
    user_id: str = "demo_user"
):
    """Get user analytics dashboard data"""
    try:
        # Get user from database
        user = await db["users"].find_one({"username": user_id})
        
        if not user:
            # Return default if user not found
            return {
                "username": "Unknown",
                "total_quests": 0,
                "total_xp": 0,
                "level": 1,
                "current_streak": 0,
                "longest_streak": 0,
                "badges_earned": 0,
                "member_since": None,
                "progress": {
                    "current_level": 1,
                    "progress_percentage": 0,
                    "needed_xp": 1000
                }
            }
        
        # Calculate level and progress
        total_xp = user.get("total_xp", 0)
        current_level = get_level_from_xp(total_xp)
        progress = get_xp_progress(total_xp)
        
        return {
            "username": user.get("username"),
            "total_quests": user.get("quests_completed", 0),
            "total_xp": total_xp,
            "level": current_level,
            "current_streak": user.get("current_streak", 0),
            "longest_streak": user.get("longest_streak", 0),
            "badges_earned": len(user.get("badges", [])),
            "member_since": user.get("created_at").isoformat() if user.get("created_at") else None,
            "progress": {
                "current_level": progress["current_level"],
                "current_xp": progress["current_xp"],
                "level_start_xp": progress["level_start_xp"],
                "level_end_xp": progress["level_end_xp"],
                "progress_xp": progress["progress_xp"],
                "needed_xp": progress["needed_xp"],
                "progress_percentage": progress["progress_percentage"]
            }
        }
    except Exception as e:
        print(f"Error in analytics: {e}")
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
