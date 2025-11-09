from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.utils.json_encoder import convert_objectid

class BadgeService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.badges_collection = db["badges"]

    async def get_all_badges(self) -> list:
        """Get all badges"""
        try:
            badges = await self.badges_collection.find({
                "is_active": True
            }).to_list(None)
            
            return [convert_objectid({
                "_id": b["_id"],
                "name": b["name"],
                "description": b["description"],
                "icon": b["icon"],
                "color": b["color"],
                "category": b["category"]
            }) for b in badges]
        except Exception as e:
            raise ValueError(f"Error fetching badges: {str(e)}")

    async def get_badge_by_id(self, badge_id: str) -> dict:
        """Get badge details"""
        try:
            badge = await self.badges_collection.find_one({
                "_id": ObjectId(badge_id)
            })
            
            if not badge:
                raise ValueError("Badge not found")
            
            return convert_objectid(badge)
        except Exception as e:
            raise ValueError(f"Error fetching badge: {str(e)}")
