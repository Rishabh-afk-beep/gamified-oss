from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
import asyncio

class Database:
    client: AsyncIOMotorClient = None
    database: AsyncIOMotorDatabase = None

# Database connection
db_instance = Database()

async def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    if db_instance.database is None:
        try:
            db_instance.client = AsyncIOMotorClient(settings.MONGODB_URL)
            db_instance.database = db_instance.client[settings.DATABASE_NAME]
            print(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")
        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")
            # For development, continue without database
            db_instance.database = None
    
    return db_instance.database

async def get_db():
    """Dependency to get database connection"""
    try:
        return await get_database()
    except Exception as e:
        print(f"⚠️ Database connection failed: {e}")
        return None

async def close_database_connection():
    """Close database connection"""
    if db_instance.client:
        db_instance.client.close()
        print("✅ Database connection closed")
