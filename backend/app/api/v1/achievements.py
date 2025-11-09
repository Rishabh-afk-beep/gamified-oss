from fastapi import APIRouter, Depends, Header
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase


from app.core.database import get_db
from app.core.security import verify_token
from typing import Optional
from bson import ObjectId

router = APIRouter(prefix="/achievements", tags=["achievements"])

@router.get("")
async def get_all_achievements(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all achievements"""
    try:
        achievements = await db["achievements"].find({}).to_list(None)
        return [{"id": str(a["_id"]), **{k: v for k, v in a.items() if k != "_id"}} for a in achievements]
    except Exception as e:
        return {"error": str(e)}

@router.get("/user/me")
async def get_my_achievements(
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get current user's achievements"""
    if not authorization:
        return {"error": "Not authenticated"}
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        return {"error": "Invalid token"}
    
    try:
        achievements = await db["achievements"].find({
            "user_id": user_id
        }).to_list(None)
        
        return [{"id": str(a["_id"]), **{k: v for k, v in a.items() if k != "_id"}} for a in achievements]
    except Exception as e:
        return {"error": str(e)}

@router.get("/{achievement_id}")
async def get_achievement(
    achievement_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get achievement details"""
    try:
        achievement = await db["achievements"].find_one({
            "_id": ObjectId(achievement_id)
        })
        
        if not achievement:
            return {"error": "Achievement not found"}
        
        return {"id": str(achievement["_id"]), **{k: v for k, v in achievement.items() if k != "_id"}}
    except Exception as e:
        return {"error": str(e)}
