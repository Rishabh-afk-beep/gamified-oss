from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
from app.utils import calculate_xp, calculate_level

class GamificationService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.users_collection = db["users"]
        self.badges_collection = db["badges"]
        self.user_badges_collection = db["user_badges"]

    async def award_xp(self, user_id: str, xp_amount: int) -> dict:
        """Award XP to user"""
        try:
            user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
            old_level = user.get("level", 1)
            new_xp = user.get("total_xp", 0) + xp_amount
            new_level = calculate_level(new_xp)
            
            await self.users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {
                    "total_xp": new_xp,
                    "level": new_level,
                    "updated_at": datetime.utcnow()
                }}
            )
            
            return {
                "xp_awarded": xp_amount,
                "total_xp": new_xp,
                "level_up": new_level > old_level,
                "new_level": new_level
            }
        except Exception as e:
            raise ValueError(f"Error awarding XP: {str(e)}")

    async def award_badge(self, user_id: str, badge_id: str) -> dict:
        """Award badge to user"""
        try:
            # Check if user already has badge
            existing = await self.user_badges_collection.find_one({
                "user_id": user_id,
                "badge_id": badge_id
            })
            
            if existing:
                return {"status": "badge_already_earned"}
            
            # Add badge
            await self.user_badges_collection.insert_one({
                "user_id": user_id,
                "badge_id": badge_id,
                "earned_at": datetime.utcnow()
            })
            
            # Add badge ID to user's badges array
            await self.users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$addToSet": {"badges": badge_id}}
            )
            
            return {"status": "badge_awarded"}
        except Exception as e:
            raise ValueError(f"Error awarding badge: {str(e)}")

    async def update_streak(self, user_id: str, increment: bool = True) -> dict:
        """Update user streak"""
        try:
            user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
            
            if increment:
                new_streak = user.get("current_streak", 0) + 1
                longest_streak = max(user.get("longest_streak", 0), new_streak)
            else:
                new_streak = 0
                longest_streak = user.get("longest_streak", 0)
            
            await self.users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {
                    "current_streak": new_streak,
                    "longest_streak": longest_streak,
                    "updated_at": datetime.utcnow()
                }}
            )
            
            return {
                "current_streak": new_streak,
                "longest_streak": longest_streak
            }
        except Exception as e:
            raise ValueError(f"Error updating streak: {str(e)}")
