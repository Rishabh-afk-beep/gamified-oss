from fastapi import APIRouter, Depends, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.core.security import verify_token
from typing import Optional
from app.services.quest_service import QuestService

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/{task_id}/submit")
async def submit_task(
    task_id: str,
    submission_data: dict,
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Submit task solution"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        service = QuestService(db)
        result = await service.submit_task(user_id, task_id, submission_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{task_id}")
async def get_task(task_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get task details"""
    try:
        service = QuestService(db)
        task = await service.get_task_by_id(task_id)
        return task
    except ValueError:
        raise HTTPException(status_code=404, detail="Task not found")
