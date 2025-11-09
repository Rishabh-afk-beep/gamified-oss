from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.core.security import verify_token
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.schemas.auth import Token
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Register new user"""
    try:
        service = AuthService(db)
        user = await service.register_user(user_data)
        return {
            "_id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
            "level": user["level"],
            "total_xp": user["total_xp"],
            "current_streak": user["current_streak"],
            "longest_streak": user["longest_streak"],
            "badges": user["badges"],
            "created_at": user.get("created_at"),
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Login user"""
    try:
        service = AuthService(db)
        token_data = await service.login_user(credentials)
        return token_data
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.get("/me", response_model=UserResponse)
async def get_current_user(
    token: str = None,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get current user info"""
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Extract token from header if needed
    if token.startswith("Bearer "):
        token = token[7:]
    
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        service = AuthService(db)
        user = await service.get_user_by_id(user_id)
        return {
            "_id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
            "level": user["level"],
            "total_xp": user["total_xp"],
            "current_streak": user["current_streak"],
            "longest_streak": user["longest_streak"],
            "badges": user["badges"],
            "created_at": user.get("created_at"),
        }
    except ValueError:
        raise HTTPException(status_code=404, detail="User not found")
