from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

# Import all routers
from app.api.v1 import ai, auth, users, quests, github_integration, analytics, github, firebase_auth
from app.core.config import settings
from app.core.database import get_database, close_database_connection

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="CodeQuest - Gamified Open Source Learning Platform",
    debug=settings.DEBUG
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(ai.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(firebase_auth.router, prefix="/api/v1")  # ✅ Added Firebase auth
app.include_router(users.router, prefix="/api/v1") 
app.include_router(quests.router, prefix="/api/v1")
app.include_router(github_integration.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(github.router, prefix="/api/v1")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "CodeQuest API is running! 🚀", "status": "healthy"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "debug": settings.DEBUG
    }

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🚀 Starting CodeQuest API server...")
    
    # Initialize database connection
    try:
        db = await get_database()
        if db:
            print("✅ Database connection established")
        else:
            print("⚠️ Running without database connection")
    except Exception as e:
        print(f"⚠️ Database initialization failed: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("🔄 Shutting down CodeQuest API server...")
    await close_database_connection()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to CodeQuest API",
        "version": settings.APP_VERSION,
        "status": "running",
        "ai_configured": bool(settings.GEMINI_API_KEY),
        "services": {
            "ai": "active",
            "auth": "placeholder", 
            "users": "placeholder",
            "quests": "placeholder",
            "github": "placeholder"
        }
    }

@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "ai_service": "configured" if settings.GEMINI_API_KEY else "not configured",
        "database": "connected",  # Will be dynamic later
        "services": {
            "ai": "active",
            "auth": "placeholder",
            "users": "placeholder", 
            "quests": "placeholder",
            "github": "placeholder"
        }
    }

# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    print(f"❌ Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": f"Internal server error: {str(exc)}",
            "message": "Something went wrong on the server"
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
