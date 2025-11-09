from fastapi import APIRouter, Depends, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.core.security import verify_token
from app.schemas.user import UserResponse, UserUpdate
from app.services.user_service import UserService
from typing import Optional

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get current user info"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Extract token from "Bearer <token>"
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        service = UserService(db)
        user = await service.get_user_by_id(user_id)
        return {
            "_id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
            "avatar_url": user.get("avatar_url"),
            "level": user.get("level", 1),
            "total_xp": user.get("total_xp", 0),
            "current_streak": user.get("current_streak", 0),
            "longest_streak": user.get("longest_streak", 0),
            "badges": user.get("badges", []),
            "created_at": user.get("created_at"),
        }
    except ValueError:
        raise HTTPException(status_code=404, detail="User not found")

@router.put("/me", response_model=UserResponse)
async def update_user(
    user_update: UserUpdate,
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update user profile"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        service = UserService(db)
        user = await service.update_user(user_id, user_update.dict(exclude_unset=True))
        return {
            "_id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
            "avatar_url": user.get("avatar_url"),
            "level": user.get("level", 1),
            "total_xp": user.get("total_xp", 0),
            "current_streak": user.get("current_streak", 0),
            "longest_streak": user.get("longest_streak", 0),
            "badges": user.get("badges", []),
            "created_at": user.get("created_at"),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me/badges")
async def get_user_badges(
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get user's earned badges"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        service = UserService(db)
        badges = await service.get_user_badges(user_id)
        return badges
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me/achievements")
async def get_user_achievements(
    authorization: Optional[str] = Header(None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get user's achievements"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        service = UserService(db)
        achievements = await service.get_user_achievements(user_id)
        return achievements
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
