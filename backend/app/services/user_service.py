from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
from typing import Optional, Dict, Any
from app.utils.json_encoder import convert_objectid
from app.models.user import User

class UserService:
    async def get_user_by_id(self, db: AsyncIOMotorDatabase, user_id: str) -> dict:
        """Get user by ID"""
        try:
            user = await db["users"].find_one({"_id": ObjectId(user_id)})
            if not user:
                raise ValueError("User not found")
            return convert_objectid(user)
        except Exception as e:
            raise ValueError(f"Error fetching user: {str(e)}")

    async def update_user(self, db: AsyncIOMotorDatabase, user_id: str, update_data: dict) -> dict:
        """Update user information"""
        try:
            update_data["updated_at"] = datetime.utcnow()
            await db["users"].update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            user = await db["users"].find_one({"_id": ObjectId(user_id)})
            return convert_objectid(user)
        except Exception as e:
            raise ValueError(f"Error updating user: {str(e)}")

    async def get_user_badges(self, db: AsyncIOMotorDatabase, user_id: str) -> list:
        """Get user's earned badges"""
        try:
            user_badges = await db["user_badges"].find({
                "user_id": user_id
            }).to_list(None)
            
            badges = []
            for ub in user_badges:
                badge = await db["badges"].find_one({
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

    async def get_user_achievements(self, db: AsyncIOMotorDatabase, user_id: str) -> list:
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

    async def add_xp(self, db: AsyncIOMotorDatabase, user_id: str, xp: int) -> dict:
        """Add XP to user and update level"""
        try:
            user = await db["users"].find_one({"_id": ObjectId(user_id)})
            if not user:
                raise ValueError("User not found")
                
            old_xp = user.get("total_xp", 0)
            new_xp = old_xp + xp
            
            # Calculate level progression
            old_level = self._calculate_level(old_xp)
            new_level = self._calculate_level(new_xp)
            level_up = new_level > old_level
            
            # Update user data
            update_data = {
                "total_xp": new_xp,
                "level": new_level,
                "updated_at": datetime.utcnow()
            }
            
            await db["users"].update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            
            return {
                "xp_added": xp, 
                "total_xp": new_xp,
                "old_level": old_level,
                "new_level": new_level,
                "level_up": level_up
            }
        except Exception as e:
            raise ValueError(f"Error adding XP: {str(e)}")

    async def complete_quest(self, db: AsyncIOMotorDatabase, user_id: str, quest_id: str, xp_reward: int) -> dict:
        """Complete a quest and update user analytics"""
        try:
            # Add XP and update level
            xp_result = await self.add_xp(db, user_id, xp_reward)
            
            # Update quest completion count
            user = await db["users"].find_one({"_id": ObjectId(user_id)})
            quests_completed = user.get("quests_completed", 0) + 1
            
            # Update streak (simple implementation - increment if completed today)
            current_streak = user.get("current_streak", 0) + 1
            longest_streak = max(user.get("longest_streak", 0), current_streak)
            
            update_data = {
                "quests_completed": quests_completed,
                "current_streak": current_streak,
                "longest_streak": longest_streak,
                "last_active": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            await db["users"].update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            
            return {
                **xp_result,
                "quests_completed": quests_completed,
                "current_streak": current_streak,
                "longest_streak": longest_streak
            }
        except Exception as e:
            raise ValueError(f"Error completing quest: {str(e)}")

    def _calculate_level(self, total_xp: int) -> int:
        """Calculate level from total XP (1000 XP per level)"""
        return (total_xp // 1000) + 1

    async def get_user_by_firebase_uid(self, db: AsyncIOMotorDatabase, firebase_uid: str) -> Optional[User]:
        """Get user by Firebase UID"""
        try:
            user_data = await db["users"].find_one({"firebase_uid": firebase_uid})
            if not user_data:
                return None
            
            # Convert MongoDB document to User model
            user_data = convert_objectid(user_data)
            return User(**user_data)
        except Exception as e:
            raise ValueError(f"Error fetching user by Firebase UID: {str(e)}")

    async def create_firebase_user(self, db: AsyncIOMotorDatabase, user_data: Dict[str, Any]) -> User:
        """Create a new user from Firebase authentication"""
        try:
            # Ensure required fields are present
            now = datetime.utcnow()
            user_data.update({
                "created_at": now,
                "updated_at": now,
                "last_login": now,
                "total_xp": user_data.get("xp", 0),
                "completed_quests": user_data.get("completed_quests", []),
                "badges": user_data.get("badges", []),
                "level": user_data.get("level", 1),
                "streak_count": 0,
                "last_activity": now
            })
            
            # Insert user into database
            result = await db["users"].insert_one(user_data)
            
            # Retrieve the created user
            created_user = await db["users"].find_one({"_id": result.inserted_id})
            created_user = convert_objectid(created_user)
            
            return User(**created_user)
        except Exception as e:
            raise ValueError(f"Error creating Firebase user: {str(e)}")

    async def update_last_login(self, db: AsyncIOMotorDatabase, user_id: str) -> None:
        """Update user's last login timestamp"""
        try:
            await db["users"].update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"last_login": datetime.utcnow()}}
            )
        except Exception as e:
            raise ValueError(f"Error updating last login: {str(e)}")

    async def get_user_by_email(self, db: AsyncIOMotorDatabase, email: str) -> Optional[User]:
        """Get user by email"""
        try:
            user_data = await db["users"].find_one({"email": email})
            if not user_data:
                return None
            
            user_data = convert_objectid(user_data)
            return User(**user_data)
        except Exception as e:
            raise ValueError(f"Error fetching user by email: {str(e)}")

# Global service instance
user_service = UserService()
