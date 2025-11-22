from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from bson import ObjectId

class User(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    username: str
    email: str
    password_hash: Optional[str] = None  # Optional for Firebase users
    firebase_uid: Optional[str] = None  # Firebase UID for Firebase auth
    display_name: Optional[str] = None  # Display name from Firebase
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    github_id: Optional[str] = None
    github_username: Optional[str] = None
    
    # Gamification
    level: int = 1
    total_xp: int = 0
    current_streak: int = 0
    longest_streak: int = 0
    badges: List[str] = []
    
    # Activity
    last_login: Optional[datetime] = None
    last_activity: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Status
    is_active: bool = True
    is_verified: bool = False
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "username": "john_doe",
                "email": "john@example.com",
                "level": 3,
                "total_xp": 1250,
            }
        }
