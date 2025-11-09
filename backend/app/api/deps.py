from fastapi import Depends, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.core.security import verify_token
from typing import Optional

async def get_current_user_id(
    authorization: Optional[str] = Header(None)
) -> str:
    """Get current user ID from token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Extract token from "Bearer <token>"
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return user_id

async def get_optional_user_id(
    authorization: Optional[str] = Header(None)
) -> Optional[str]:
    """Get optional current user ID from token"""
    if not authorization:
        return None
    
    token = authorization.replace("Bearer ", "")
    return verify_token(token)

async def verify_admin(
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> str:
    """Verify user is admin"""
    from bson import ObjectId
    
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    
    if not user or not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return user_id
