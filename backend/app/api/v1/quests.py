from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.services.quest_service import QuestService
from typing import List

router = APIRouter(prefix="/quests", tags=["quests"])

@router.get("")
async def get_quests(
    skip: int = 0,
    limit: int = 50,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all published quests"""
    try:
        service = QuestService(db)
        quests = await service.get_all_quests(limit=limit, skip=skip)
        return quests
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{quest_id}")
async def get_quest(quest_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get quest by ID"""
    try:
        service = QuestService(db)
        quest = await service.get_quest_by_id(quest_id)
        return quest
    except ValueError:
        raise HTTPException(status_code=404, detail="Quest not found")

@router.post("/{quest_id}/start")
async def start_quest(
    quest_id: str,
    user_id: str,  # Should come from auth token in production
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Start a quest"""
    try:
        service = QuestService(db)
        result = await service.start_quest(user_id, quest_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
