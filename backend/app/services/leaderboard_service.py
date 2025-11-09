from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.utils.json_encoder import convert_objectid

class LeaderboardService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.users_collection = db["users"]

    async def get_leaderboard(self, type: str = "all_time", limit: int = 50) -> list:
        """Get leaderboard"""
        try:
            users = await self.users_collection.find({
                "is_active": True
            }).sort("total_xp", -1).limit(limit).to_list(limit)
            
            leaderboard = []
            for idx, user in enumerate(users):
                leaderboard.append(convert_objectid({
                    "rank": idx + 1,
                    "_id": user["_id"],
                    "username": user["username"],
                    "level": user.get("level", 1),
                    "total_xp": user.get("total_xp", 0),
                    "current_streak": user.get("current_streak", 0),
                    "avatar_url": user.get("avatar_url"),
                    "badges": user.get("badges", []),
                }))
            
            return leaderboard
        except Exception as e:
            raise ValueError(f"Error fetching leaderboard: {str(e)}")

    async def get_user_rank(self, user_id: str, type: str = "all_time") -> dict:
        """Get specific user's rank"""
        try:
            user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
            if not user:
                raise ValueError("User not found")
            
            rank = await self.users_collection.count_documents({
                "total_xp": {"$gt": user.get("total_xp", 0)},
                "is_active": True
            })
            
            return {
                "user_id": user_id,
                "rank": rank + 1,
                "username": user["username"],
                "level": user.get("level", 1),
                "total_xp": user.get("total_xp", 0)
            }
        except Exception as e:
            raise ValueError(f"Error fetching rank: {str(e)}")
