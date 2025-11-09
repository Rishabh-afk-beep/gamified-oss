import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings

async def init_db():
    """Initialize database with collections"""
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = client[settings.DATABASE_NAME]
        
        # Test connection
        await db.command("ping")
        print("✅ Connected to MongoDB")
        
        # Create collections
        collection_names = await db.list_collection_names()
        
        collections = [
            "users", "quests", "tasks", "user_quests", 
            "badges", "user_badges", "submissions", 
            "achievements", "notifications", "chat_history",
            "code_reviews", "github_contributions", "analytics"
        ]
        
        for collection_name in collections:
            if collection_name not in collection_names:
                await db.create_collection(collection_name)
                print(f"✅ Created collection: {collection_name}")
            else:
                print(f"⚠️  Collection already exists: {collection_name}")
        
        # Create indexes
        try:
            await db["users"].create_index("email", unique=True)
            print("✅ Created unique index on users.email")
        except Exception as e:
            print(f"⚠️  Index on users.email already exists")
        
        try:
            await db["users"].create_index("username", unique=True)
            print("✅ Created unique index on users.username")
        except Exception as e:
            print(f"⚠️  Index on users.username already exists")
        
        try:
            await db["quests"].create_index("title")
            print("✅ Created index on quests.title")
        except Exception as e:
            print(f"⚠️  Index on quests.title already exists")
        
        print("\n✅ Database initialized successfully!")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()
        print("✅ MongoDB connection closed")

if __name__ == "__main__":
    asyncio.run(init_db())
