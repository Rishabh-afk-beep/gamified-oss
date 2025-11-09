from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

class DatabaseClient:
    def __init__(self):
        self.client: AsyncIOMotorClient = None
        self.db: AsyncIOMotorDatabase = None

    async def connect(self):
        """Connect to MongoDB"""
        try:
            self.client = AsyncIOMotorClient(settings.MONGODB_URL)
            self.db = self.client[settings.DATABASE_NAME]
            # Test connection
            await self.db.command("ping")
            print("✅ Connected to MongoDB")
        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")
            raise

    async def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
            print("❌ Disconnected from MongoDB")

    async def get_database(self) -> AsyncIOMotorDatabase:
        """Get database instance"""
        return self.db

db_client = DatabaseClient()

async def get_db() -> AsyncIOMotorDatabase:
    """Dependency for getting database"""
    return db_client.db
