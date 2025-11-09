from fastapi import APIRouter, Depends, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.core.security import verify_token
from typing import Optional
from pydantic import BaseModel
from app.services.submission_service import SubmissionService

class SubmissionCreate(BaseModel):
    task_id: str
    code: str
    language: str = "javascript"

router = APIRouter(prefix="/submissions", tags=["submissions"])

@router.post("")
async def create_submission(
    submission_data: SubmissionCreate,
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create code submission"""
    if not authorization:
        return {"error": "Not authenticated"}
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        return {"error": "Invalid token"}
    
    try:
        service = SubmissionService(db)
        result = await service.create_submission(
            user_id,
            submission_data.task_id,
            submission_data.code,
            submission_data.language
        )
        return result
    except Exception as e:
        return {"error": str(e)}

@router.get("/{submission_id}")
async def get_submission(
    submission_id: str,
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get submission details"""
    if not authorization:
        return {"error": "Not authenticated"}
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        return {"error": "Invalid token"}
    
    try:
        service = SubmissionService(db)
        submission = await service.get_submission(submission_id)
        return submission
    except Exception as e:
        return {"error": str(e)}

@router.post("/{submission_id}/evaluate")
async def evaluate_submission(
    submission_id: str,
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Evaluate submission"""
    if not authorization:
        return {"error": "Not authenticated"}
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        return {"error": "Invalid token"}
    
    try:
        service = SubmissionService(db)
        result = await service.evaluate_submission(submission_id)
        return result
    except Exception as e:
        return {"error": str(e)}

@router.get("/user/me")
async def get_my_submissions(
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db),
    limit: int = 50
):
    """Get current user's submissions"""
    if not authorization:
        return {"error": "Not authenticated"}
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        return {"error": "Invalid token"}
    
    try:
        service = SubmissionService(db)
        submissions = await service.get_user_submissions(user_id, limit=limit)
        return submissions
    except Exception as e:
        return {"error": str(e)}
