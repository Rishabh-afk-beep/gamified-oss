from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime, timedelta
from app.utils.json_encoder import convert_objectid

# Import in-memory storage from quest service
from app.services.quest_service import IN_MEMORY_USERS

class AnalyticsService:
    def __init__(self, db: AsyncIOMotorDatabase = None):
        self.db = db
        if db:
            self.users_collection = db["users"]
            self.user_quests_collection = db["user_quests"]
            self.submissions_collection = db["submissions"]

    async def get_user_analytics(self, user_id: str) -> dict:
        """Get user analytics (in-memory version)"""
        try:
            # Get user data from in-memory storage
            user = IN_MEMORY_USERS.get(user_id)
            
            if not user:
                # Create default user if not exists
                default_user = {
                    "username": user_id,
                    "total_xp": 0,
                    "level": 1,
                    "quests_completed": 0,
                    "current_streak": 0,
                    "longest_streak": 0,
                    "badges_earned": 0,
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                }
                IN_MEMORY_USERS[user_id] = default_user
                user = default_user
            
            # Calculate progress to next level
            current_xp = user.get("total_xp", 0)
            current_level = user.get("level", 1)
            level_start_xp = (current_level - 1) * 1000
            level_end_xp = current_level * 1000
            progress_xp = current_xp - level_start_xp
            needed_xp = level_end_xp - current_xp
            progress_percentage = (progress_xp / 1000) * 100 if current_xp > 0 else 0
            
            return {
                "username": user.get("username", user_id),
                "total_quests": user.get("quests_completed", 0),
                "quests_completed": user.get("quests_completed", 0),  # ✅ Add this field for test compatibility
                "total_xp": current_xp,
                "level": current_level,
                "current_streak": user.get("current_streak", 0),
                "longest_streak": user.get("longest_streak", 0),
                "badges_earned": user.get("badges_earned", 0),
                "member_since": user.get("created_at"),
                "progress": {
                    "current_level": current_level,
                    "current_xp": current_xp,
                    "level_start_xp": level_start_xp,
                    "level_end_xp": level_end_xp,
                    "progress_xp": progress_xp,
                    "needed_xp": needed_xp,
                    "progress_percentage": progress_percentage
                }
            }
        except Exception as e:
            print(f"❌ Error fetching analytics: {e}")
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
