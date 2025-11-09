from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
from bson import ObjectId
from app.utils.json_encoder import convert_objectid

class QuestService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.quests_collection = db["quests"]
        self.user_quests_collection = db["user_quests"]
        self.tasks_collection = db["tasks"]
        self.submissions_collection = db["submissions"]

    async def create_quest(self, quest_data: dict, user_id: str) -> dict:
        """Create new quest"""
        quest = {
            **quest_data,
            "created_by": user_id,
            "is_published": False,
            "is_archived": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = await self.quests_collection.insert_one(quest)
        quest["_id"] = result.inserted_id
        return convert_objectid(quest)

    async def get_all_quests(self, limit: int = 50, skip: int = 0) -> list:
        """Get all published quests"""
        quests = await self.quests_collection.find({
            "is_published": True,
            "is_archived": False
        }).skip(skip).limit(limit).to_list(limit)
        
        return [convert_objectid(q) for q in quests]

    async def get_quest_by_id(self, quest_id: str) -> dict:
        """Get quest by ID"""
        quest = await self.quests_collection.find_one({"_id": ObjectId(quest_id)})
        if not quest:
            raise ValueError("Quest not found")
        return convert_objectid(quest)

    async def start_quest(self, user_id: str, quest_id: str) -> dict:
        """User starts a quest"""
        user_quest = {
            "user_id": user_id,
            "quest_id": quest_id,
            "started_at": datetime.utcnow(),
            "completed_at": None,
            "completed_tasks": [],
            "status": "in_progress",
        }
        
        result = await self.user_quests_collection.insert_one(user_quest)
        return {"quest_started": True, "id": str(result.inserted_id)}

    async def complete_task(self, user_id: str, quest_id: str, task_id: str) -> dict:
        """Mark task as complete"""
        await self.user_quests_collection.update_one(
            {
                "user_id": user_id,
                "quest_id": quest_id
            },
            {"$addToSet": {"completed_tasks": task_id}}
        )
        
        return {"task_completed": True}

    async def submit_task(self, user_id: str, task_id: str, submission_data: dict) -> dict:
        """Submit task solution"""
        submission = {
            "user_id": user_id,
            "task_id": task_id,
            "code": submission_data.get("code", ""),
            "language": submission_data.get("language", "javascript"),
            "status": "pending",
            "created_at": datetime.utcnow(),
        }
        
        result = await self.submissions_collection.insert_one(submission)
        return {
            "submission_id": str(result.inserted_id),
            "status": "pending"
        }

    async def get_task_by_id(self, task_id: str) -> dict:
        """Get task by ID"""
        task = await self.tasks_collection.find_one({"_id": ObjectId(task_id)})
        if not task:
            raise ValueError("Task not found")
        return convert_objectid(task)
