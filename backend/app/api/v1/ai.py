from fastapi import APIRouter, Depends, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.core.security import verify_token
from typing import Optional
from pydantic import BaseModel

class ChatMessage(BaseModel):
    message: str
    context: Optional[dict] = None

class CodeReviewRequest(BaseModel):
    code: str
    language: str
    context: Optional[dict] = None

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/chat")
async def chat_with_ai(
    chat_msg: ChatMessage,
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Chat with AI assistant"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        # For now, return mock response
        return {
            "message": f"I received your message: '{chat_msg.message}'. AI integration coming soon!",
            "suggestions": []
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/code-review")
async def review_code(
    review_req: CodeReviewRequest,
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get AI code review"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        # For now, return mock response
        return {
            "correct": ["Code structure looks good", "Proper variable naming"],
            "warnings": ["Missing error handling"],
            "improvements": ["Consider using async/await"],
            "score": 75
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/hint/{task_id}")
async def get_hint(
    task_id: str,
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get hint for task"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        return {"hint": "Think about breaking down the problem into smaller parts"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/explain")
async def explain_concept(
    explanation_req: dict,
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Explain a coding concept"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        concept = explanation_req.get("concept", "")
        return {
            "concept": concept,
            "explanation": f"Explanation for {concept} will be provided by AI integration."
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
