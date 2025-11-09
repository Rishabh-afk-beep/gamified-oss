from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime, timedelta
from app.utils.json_encoder import convert_objectid

class AnalyticsService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.users_collection = db["users"]
        self.user_quests_collection = db["user_quests"]
        self.submissions_collection = db["submissions"]

    async def get_user_analytics(self, user_id: str) -> dict:
        """Get user analytics"""
        try:
            user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
            
            quests_completed = await self.user_quests_collection.count_documents({
                "user_id": user_id,
                "status": "completed"
            })
            
            tasks_completed = await self.submissions_collection.count_documents({
                "user_id": user_id,
                "status": "passed"
            })
            
            return {
                "total_quests": quests_completed,
                "total_tasks": tasks_completed,
                "total_xp": user.get("total_xp", 0),
                "level": user.get("level", 1),
                "current_streak": user.get("current_streak", 0),
                "longest_streak": user.get("longest_streak", 0),
                "avg_time": "2.5h",
                "streak_days": user.get("current_streak", 0)
            }
        except Exception as e:
            raise ValueError(f"Error fetching analytics: {str(e)}")

    async def get_progress_data(self, user_id: str) -> list:
        """Get progress data over time"""
        try:
            progress_data = []
            for i in range(30):
                date = datetime.utcnow() - timedelta(days=30-i)
                progress_data.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "quests": i // 3,
                    "tasks": i,
                    "xp": i * 50
                })
            
            return progress_data
        except Exception as e:
            raise ValueError(f"Error fetching progress: {str(e)}")
