from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
from app.utils.json_encoder import convert_objectid

class UserService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.users_collection = db["users"]
        self.badges_collection = db["badges"]
        self.user_badges_collection = db["user_badges"]

    async def get_user_by_id(self, user_id: str) -> dict:
        """Get user by ID"""
        try:
            user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
            if not user:
                raise ValueError("User not found")
            return convert_objectid(user)
        except Exception as e:
            raise ValueError(f"Error fetching user: {str(e)}")

    async def update_user(self, user_id: str, update_data: dict) -> dict:
        """Update user information"""
        try:
            update_data["updated_at"] = datetime.utcnow()
            await self.users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
            return convert_objectid(user)
        except Exception as e:
            raise ValueError(f"Error updating user: {str(e)}")

    async def get_user_badges(self, user_id: str) -> list:
        """Get user's earned badges"""
        try:
            user_badges = await self.user_badges_collection.find({
                "user_id": user_id
            }).to_list(None)
            
            badges = []
            for ub in user_badges:
                badge = await self.badges_collection.find_one({
                    "_id": ObjectId(ub["badge_id"])
                })
                if badge:
                    badges.append({
                        "id": str(badge["_id"]),
                        "name": badge["name"],
                        "icon": badge["icon"],
                        "earned_at": ub["earned_at"].isoformat() if isinstance(ub["earned_at"], datetime) else ub["earned_at"]
                    })
            
            return badges
        except Exception as e:
            raise ValueError(f"Error fetching badges: {str(e)}")

    async def get_user_achievements(self, user_id: str) -> list:
        """Get user's achievements"""
        try:
            achievements = [
                {
                    "id": "1",
                    "title": "First Steps",
                    "description": "Complete your first quest",
                    "xp": 50,
                    "date": datetime.utcnow().isoformat(),
                    "type": "quest"
                }
            ]
            return achievements
        except Exception as e:
            raise ValueError(f"Error fetching achievements: {str(e)}")

    async def add_xp(self, user_id: str, xp: int) -> dict:
        """Add XP to user"""
        try:
            user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
            new_xp = user.get("total_xp", 0) + xp
            
            await self.users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {
                    "total_xp": new_xp,
                    "updated_at": datetime.utcnow()
                }}
            )
            
            return {"xp_added": xp, "total_xp": new_xp}
        except Exception as e:
            raise ValueError(f"Error adding XP: {str(e)}")
