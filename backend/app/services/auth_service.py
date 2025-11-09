from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.security import get_password_hash, verify_password, create_access_token
from app.schemas.user import UserCreate, UserLogin
from datetime import timedelta

class AuthService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.users_collection = db["users"]

    async def register_user(self, user_data: UserCreate) -> dict:
        """Register new user"""
        # Check if user exists
        existing_user = await self.users_collection.find_one({"email": user_data.email})
        if existing_user:
            raise ValueError("Email already registered")

        # Create new user
        user = {
            "username": user_data.username,
            "email": user_data.email,
            "password_hash": get_password_hash(user_data.password),
            "level": 1,
            "total_xp": 0,
            "current_streak": 0,
            "longest_streak": 0,
            "badges": [],
            "is_active": True,
            "is_verified": False,
        }

        result = await self.users_collection.insert_one(user)
        user["_id"] = result.inserted_id
        return user

    async def login_user(self, login_data: UserLogin) -> dict:
        """Login user and return token"""
        user = await self.users_collection.find_one({"email": login_data.email})
        if not user:
            raise ValueError("Invalid email or password")

        if not verify_password(login_data.password, user["password_hash"]):
            raise ValueError("Invalid email or password")

        # Create token
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": str(user["_id"])},
            expires_delta=access_token_expires
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user["_id"]),
                "username": user["username"],
                "email": user["email"],
            }
        }

    async def get_user_by_id(self, user_id: str) -> dict:
        """Get user by ID"""
        from bson import ObjectId
        user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise ValueError("User not found")
        user["id"] = str(user["_id"])
        return user
