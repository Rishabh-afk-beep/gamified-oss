from fastapi import APIRouter, Depends, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.core.security import verify_token
from typing import Optional
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("")
async def get_notifications(
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db),
    unread_only: bool = False,
    limit: int = 50
):
    """Get user notifications"""
    if not authorization:
        return {"error": "Not authenticated"}
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        return {"error": "Invalid token"}
    
    try:
        query = {"user_id": user_id}
        if unread_only:
            query["is_read"] = False
        
        notifications = await db["notifications"].find(query).sort(
            "created_at", -1
        ).limit(limit).to_list(limit)
        
        return [{"id": str(n["_id"]), **{k: v for k, v in n.items() if k != "_id"}} for n in notifications]
    except Exception as e:
        return {"error": str(e)}

@router.put("/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Mark notification as read"""
    if not authorization:
        return {"error": "Not authenticated"}
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        return {"error": "Invalid token"}
    
    try:
        await db["notifications"].update_one(
            {
                "_id": ObjectId(notification_id),
                "user_id": user_id
            },
            {"$set": {"is_read": True}}
        )
        
        return {"status": "marked_as_read"}
    except Exception as e:
        return {"error": str(e)}

@router.post("/mark-all-read")
async def mark_all_as_read(
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Mark all notifications as read"""
    if not authorization:
        return {"error": "Not authenticated"}
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        return {"error": "Invalid token"}
    
    try:
        await db["notifications"].update_many(
            {"user_id": user_id},
            {"$set": {"is_read": True}}
        )
        
        return {"status": "all_marked_as_read"}
    except Exception as e:
        return {"error": str(e)}
