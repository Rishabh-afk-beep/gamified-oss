from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.api.v1 import ai
from app.api.v1 import github
from app.api.v1 import tutorials
from app.api.v1 import quests_system
from app.api.v1 import workflow




from app.core.database import db_client
from app.api.v1 import router as api_router
from app.utils.json_encoder import MongoJSONEncoder
import json


# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting CodeQuest API...")
    print(f"📝 App: {settings.APP_NAME}")
    print(f"🔧 Version: {settings.APP_VERSION}")
    print(f"🌐 Environment: {'DEBUG' if settings.DEBUG else 'PRODUCTION'}")
    
    await db_client.connect()
    print("✅ Connected to MongoDB")
    print("✅ Application started successfully!")
    print("📖 API Docs: http://localhost:8000/docs")
    print("🔗 ReDoc: http://localhost:8000/redoc")
    
    yield
    
    # Shutdown
    print("\n🛑 Shutting down application...")
    await db_client.disconnect()
    print("✅ Application shut down successfully!")

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="Gamified Open Source Coding Education Platform",
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Set custom JSON encoder
app.json_encoder = MongoJSONEncoder

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api_router)
app.include_router(ai.router)
app.include_router(github.router)
app.include_router(tutorials.router)
app.include_router(quests_system.router)
app.include_router(workflow.router)




# Health check
@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "debug": settings.DEBUG,
    }

# Root endpoint
@app.get("/", tags=["root"])
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to CodeQuest API",
        "version": settings.APP_VERSION,
        "endpoints": {
            "docs": "/docs",
            "redoc": "/redoc",
            "health": "/health",
            "api": "/api/v1"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
