import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "CodeQuest"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Server settings  
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database settings
    MONGODB_URL: str = "mongodb://localhost:27017/codequest"
    DATABASE_NAME: str = "codequest"
    
    # JWT settings
    SECRET_KEY: str = "your-super-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # GitHub settings
    GITHUB_TOKEN: str = ""
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    GITHUB_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/github/callback"
    
    # Gemini AI Configuration
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash-lite"
    GEMINI_MAX_TOKENS: int = 1000
    GEMINI_TEMPERATURE: float = 0.7
    
    # Firebase Configuration
    FIREBASE_PROJECT_ID: str = "gamified-oss"
    FIREBASE_API_KEY: str = ""
    FIREBASE_AUTH_DOMAIN: str = "gamified-oss.firebaseapp.com"
    FIREBASE_STORAGE_BUCKET: str = "gamified-oss.firebasestorage.app"
    FIREBASE_MESSAGING_SENDER_ID: str = "189137801621"
    FIREBASE_APP_ID: str = "1:189137801621:web:d73bba21c289e8522ca69c"
    
    # CORS settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",  # ✅ Added for frontend
        "http://localhost:3000", 
        "http://localhost:8000"
    ]
    
    class Config:
        env_file = ".env.local"
        case_sensitive = True

settings = Settings()

# Validate critical settings on startup
def validate_settings():
    errors = []
    warnings = []
    
    if not settings.GEMINI_API_KEY:
        errors.append("❌ GEMINI_API_KEY not found in environment variables")
    elif len(settings.GEMINI_API_KEY) < 30:
        warnings.append("⚠️  GEMINI_API_KEY seems too short")
    
    if not settings.SECRET_KEY or settings.SECRET_KEY == "your-super-secret-key-here":
        warnings.append("⚠️  Using default SECRET_KEY - please change for production")
    
    if errors:
        print("\n🔧 Configuration Errors:")
        for error in errors:
            print(f"   {error}")
    
    if warnings:
        print("\n⚠️  Configuration Warnings:")
        for warning in warnings:
            print(f"   {warning}")
    
    if not errors and not warnings:
        print("✅ Configuration validated successfully")
    
    return len(errors) == 0

# Run validation on import
validate_settings()
