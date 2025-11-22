"""
Quest management routes
"""
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.services.quest_service import QuestService
from pydantic import BaseModel

router = APIRouter(prefix="/quests", tags=["quests"])

class CompleteQuestRequest(BaseModel):
    quest_id: str
    user_id: str = "demo_user"

@router.get("/health")
async def quests_health():
    """Quests service health check"""
    return {"status": "quests service active"}

@router.get("")
async def get_quests():
    """Get all available quests (in-memory version)"""
    try:
        quest_service = QuestService()
        quests = await quest_service.get_all_quests()
        
        print(f"📚 Returning {len(quests)} quests")
        return quests  # Return list directly, not wrapped in dict
    except Exception as e:
        print(f"❌ Error in get_quests: {e}")
        return {"error": str(e)}

@router.get("/")
async def get_quests_slash():
    """Get all available quests with trailing slash (in-memory version)"""
    return await get_quests()

@router.post("/complete")
async def complete_quest(
    request: CompleteQuestRequest
):
    """Complete a quest and update user analytics (in-memory version)"""
    try:
        quest_service = QuestService()
        result = await quest_service.complete_quest(request.user_id, request.quest_id)
        print(f"🎯 Quest {request.quest_id} completed by {request.user_id}")
        return {
            "message": "Quest completed successfully!",
            "data": result
        }
    except Exception as e:
        print(f"❌ Error completing quest: {e}")
        return {"error": str(e)}

@router.post("/start")
async def start_quest(
    request: CompleteQuestRequest
):
    """Start a quest (in-memory version)"""
    try:
        quest_service = QuestService()
        result = await quest_service.start_quest(request.user_id, request.quest_id)
        print(f"▶️ Quest {request.quest_id} started by {request.user_id}")
        return {
            "message": "Quest started successfully!",
            "data": result
        }
    except Exception as e:
        print(f"❌ Error starting quest: {e}")
        return {"error": str(e)}
