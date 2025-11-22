"""
Firebase Authentication Middleware
Handles Firebase token verification for protected endpoints
"""

from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any
from app.services.firebase_service import firebase_admin_service
from app.services.user_service import user_service
from app.models.user import User
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db

security = HTTPBearer()

class FirebaseAuthMiddleware:
    """Firebase authentication middleware for FastAPI"""
    
    async def verify_firebase_token(
        self,
        credentials: HTTPAuthorizationCredentials = Depends(security),
        db: AsyncIOMotorDatabase = Depends(get_db)
    ) -> Dict[str, Any]:
        """
        Verify Firebase ID token and return user information
        
        Args:
            credentials: Authorization header with Bearer token
            db: Database connection
            
        Returns:
            User information from Firebase
            
        Raises:
            HTTPException: If token is invalid or user not found
        """
        if not credentials:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization header is required"
            )
        
        # Extract token from Bearer header
        token = credentials.credentials
        
        try:
            # Verify Firebase token
            firebase_user = await firebase_admin_service.verify_token(token)
            
            if not firebase_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or expired token"
                )
            
            return firebase_user
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token verification failed: {str(e)}"
            )
    
    async def get_current_user(
        self,
        firebase_user: Dict[str, Any],
        db: AsyncIOMotorDatabase
    ) -> User:
        """
        Get current user from database using Firebase user info
        
        Args:
            firebase_user: Firebase user information from token verification
            db: Database connection
            
        Returns:
            User object from database
            
        Raises:
            HTTPException: If user not found in database
        """
        try:
            # Find user in our database by Firebase UID
            user = await user_service.get_user_by_firebase_uid(db, firebase_user['uid'])
            
            if not user:
                # If user doesn't exist in our database, create them
                user_data = {
                    'firebase_uid': firebase_user['uid'],
                    'email': firebase_user.get('email'),
                    'username': firebase_user.get('email', '').split('@')[0],  # Use email prefix as username
                    'display_name': firebase_user.get('name', firebase_user.get('email', '')),
                    'avatar_url': firebase_user.get('picture'),
                    'level': 1,
                    'xp': 0,
                    'badges': [],
                    'completed_quests': [],
                    'created_at': None,  # Will be set by user service
                    'last_login': None
                }
                
                user = await user_service.create_firebase_user(db, user_data)
                print(f"✅ Created new user in database: {user.email}")
            else:
                # Update last login time
                await user_service.update_last_login(db, user.id)
                print(f"✅ User logged in: {user.email}")
            
            return user
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get user: {str(e)}"
            )

# Global middleware instance
firebase_auth = FirebaseAuthMiddleware()

# Dependency functions for FastAPI routes
async def verify_firebase_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Dict[str, Any]:
    """Dependency function for token verification"""
    return await firebase_auth.verify_firebase_token(credentials, db)

async def get_current_user(
    firebase_user: Dict[str, Any] = Depends(verify_firebase_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> User:
    """Dependency function for getting current user"""
    return await firebase_auth.get_current_user(firebase_user, db)

# Optional dependency (returns None if no token provided)
async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Optional[User]:
    """Optional dependency that returns None if no token provided"""
    if not credentials:
        return None
    
    try:
        firebase_user = await firebase_admin_service.verify_token(credentials.credentials)
        if firebase_user:
            return await user_service.get_user_by_firebase_uid(db, firebase_user['uid'])
    except:
        return None
    
    return None