import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings

async def seed_data():
    """Seed database with sample data"""
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = client[settings.DATABASE_NAME]
        
        # Test connection
        await db.command("ping")
        print("✅ Connected to MongoDB")
        
        # Sample quests
        quests = [
            {
                "title": "Exploring GitHub",
                "description": "Learn the basics of GitHub and version control",
                "difficulty": "beginner",
                "xp_reward": 100,
                "estimated_duration": 30,
                "objectives": ["Understand GitHub basics", "Explore repositories", "Learn about commits"],
                "prerequisites": [],
                "is_published": True,
                "is_archived": False,
                "category": "github",
                "tags": ["github", "basics", "version-control"],
                "order": 1,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "created_by": "system"
            },
            {
                "title": "Your First Pull Request",
                "description": "Make your first contribution to open source",
                "difficulty": "beginner",
                "xp_reward": 200,
                "estimated_duration": 60,
                "objectives": ["Fork a repository", "Create a pull request", "Understand PR workflow"],
                "prerequisites": ["Exploring GitHub"],
                "is_published": True,
                "is_archived": False,
                "category": "open_source",
                "tags": ["github", "pull_request", "contribution"],
                "order": 2,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "created_by": "system"
            },
            {
                "title": "Python Basics",
                "description": "Learn Python programming fundamentals",
                "difficulty": "beginner",
                "xp_reward": 150,
                "estimated_duration": 45,
                "objectives": ["Variables and data types", "Control flow", "Functions"],
                "prerequisites": [],
                "is_published": True,
                "is_archived": False,
                "category": "coding",
                "tags": ["python", "basics", "programming"],
                "order": 3,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "created_by": "system"
            },
        ]
        
        result = await db["quests"].insert_many(quests)
        print(f"✅ Inserted {len(result.inserted_ids)} quests!")
        
        # Sample badges
        badges = [
            {
                "name": "First Steps",
                "description": "Complete your first quest",
                "icon": "🎯",
                "color": "blue",
                "category": "quest",
                "criteria_type": "quest_complete",
                "criteria_value": 1,
                "is_active": True,
                "created_at": datetime.utcnow(),
            },
            {
                "name": "Week Warrior",
                "description": "Maintain a 7-day streak",
                "icon": "🔥",
                "color": "orange",
                "category": "streak",
                "criteria_type": "streak_days",
                "criteria_value": 7,
                "is_active": True,
                "created_at": datetime.utcnow(),
            },
            {
                "name": "Code Master",
                "description": "Reach level 5",
                "icon": "👑",
                "color": "gold",
                "category": "level",
                "criteria_type": "level_reached",
                "criteria_value": 5,
                "is_active": True,
                "created_at": datetime.utcnow(),
            },
        ]
        
        result = await db["badges"].insert_many(badges)
        print(f"✅ Inserted {len(result.inserted_ids)} badges!")
        
        print("\n✅ Data seeding completed successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()
        print("✅ MongoDB connection closed")

if __name__ == "__main__":
    asyncio.run(seed_data())
