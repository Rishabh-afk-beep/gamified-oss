from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.services.badge_service import BadgeService

router = APIRouter(prefix="/badges", tags=["badges"])

@router.get("")
async def get_all_badges(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all badges"""
    try:
        # Try database first, fallback to mock data
        try:
            service = BadgeService(db)
            badges = await service.get_all_badges()
            return badges
        except Exception:
            # Fallback to mock badges for testing
            mock_badges = [
                {
                    "id": "first_quest",
                    "name": "First Quest",
                    "description": "Complete your first quest",
                    "criteria": "Complete any quest",
                    "icon": "🎯",
                    "xp_required": 0,
                    "rarity": "common"
                },
                {
                    "id": "code_reviewer",
                    "name": "Code Reviewer", 
                    "description": "Complete 5 code reviews",
                    "criteria": "Review 5 code submissions",
                    "icon": "👨‍💻",
                    "xp_required": 500,
                    "rarity": "rare"
                },
                {
                    "id": "github_explorer",
                    "name": "GitHub Explorer",
                    "description": "Connect GitHub account",
                    "criteria": "Link GitHub profile",
                    "icon": "🚀",
                    "xp_required": 100,
                    "rarity": "common"
                }
            ]
            return mock_badges
    except Exception as e:
        return {"error": str(e)}

@router.get("/{badge_id}")
async def get_badge(badge_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get badge details"""
    try:
        service = BadgeService(db)
        badge = await service.get_badge_by_id(badge_id)
        return badge
    except Exception as e:
        return {"error": str(e)}
