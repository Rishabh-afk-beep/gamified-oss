"""
Firebase Authentication Routes
Handles Firebase-based authentication endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_db
from app.services.firebase_service import firebase_admin_service
from app.services.user_service import user_service
from app.middleware.firebase_auth import get_current_user, verify_firebase_token
from app.models.user import User

router = APIRouter()

class FirebaseLoginRequest(BaseModel):
    """Request model for Firebase login"""
    id_token: str

class FirebaseRegisterRequest(BaseModel):
    """Request model for Firebase registration"""
    id_token: str
    username: str = None
    display_name: str = None

class AuthResponse(BaseModel):
    """Authentication response model"""
    user: Dict[str, Any]
    message: str
    access_token: str = None

@router.post("/firebase/login", response_model=AuthResponse)
async def firebase_login(
    request: FirebaseLoginRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Login with Firebase ID token
    
    Args:
        request: Firebase login request with ID token
        db: Database connection
        
    Returns:
        User information and success message
    """
    try:
        # Verify Firebase token
        firebase_user = await firebase_admin_service.verify_token(request.id_token)
        
        if not firebase_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired Firebase token"
            )
        
        # Get or create user in our database
        user = await user_service.get_user_by_firebase_uid(db, firebase_user['uid'])
        
        if not user:
            # Create new user if doesn't exist
            user_data = {
                'firebase_uid': firebase_user['uid'],
                'email': firebase_user.get('email'),
                'username': firebase_user.get('email', '').split('@')[0],
                'display_name': firebase_user.get('name', firebase_user.get('email', '')),
                'avatar_url': firebase_user.get('picture'),
                'level': 1,
                'xp': 0,
                'badges': [],
                'completed_quests': []
            }
            
            user = await user_service.create_firebase_user(db, user_data)
            message = "Account created and logged in successfully"
        else:
            # Update last login
            await user_service.update_last_login(db, user.id)
            message = "Logged in successfully"
        
        # Convert user to dict for response
        user_dict = user.model_dump()
        user_dict['id'] = str(user.id)
        
        return AuthResponse(
            user=user_dict,
            message=message,
            access_token=request.id_token  # Use Firebase token as access token
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/firebase/register", response_model=AuthResponse)
async def firebase_register(
    request: FirebaseRegisterRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Register with Firebase ID token
    
    Args:
        request: Firebase registration request with ID token and additional info
        db: Database connection
        
    Returns:
        User information and success message
    """
    try:
        # Verify Firebase token
        firebase_user = await firebase_admin_service.verify_token(request.id_token)
        
        if not firebase_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired Firebase token"
            )
        
        # Check if user already exists
        existing_user = await user_service.get_user_by_firebase_uid(db, firebase_user['uid'])
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User already exists"
            )
        
        # Create new user
        user_data = {
            'firebase_uid': firebase_user['uid'],
            'email': firebase_user.get('email'),
            'username': request.username or firebase_user.get('email', '').split('@')[0],
            'display_name': request.display_name or firebase_user.get('name', firebase_user.get('email', '')),
            'avatar_url': firebase_user.get('picture'),
            'level': 1,
            'xp': 0,
            'badges': [],
            'completed_quests': []
        }
        
        user = await user_service.create_firebase_user(db, user_data)
        
        # Convert user to dict for response
        user_dict = user.model_dump()
        user_dict['id'] = str(user.id)
        
        return AuthResponse(
            user=user_dict,
            message="Account created successfully",
            access_token=request.id_token
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.get("/me", response_model=Dict[str, Any])
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user information
    
    Args:
        current_user: Current authenticated user from Firebase token
        
    Returns:
        User information
    """
    try:
        user_dict = current_user.model_dump()
        user_dict['id'] = str(current_user.id)
        
        return {
            "data": user_dict,
            "message": "User information retrieved successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user information: {str(e)}"
        )

@router.post("/logout")
async def logout():
    """
    Logout endpoint (Firebase handles token invalidation on client side)
    
    Returns:
        Success message
    """
    return {
        "message": "Logged out successfully",
        "data": None
    }

@router.get("/verify-token")
async def verify_token(
    firebase_user: Dict[str, Any] = Depends(verify_firebase_token)
):
    """
    Verify Firebase token endpoint
    
    Args:
        firebase_user: Firebase user information from token verification
        
    Returns:
        Token verification result
    """
    return {
        "valid": True,
        "user": firebase_user,
        "message": "Token is valid"
    }