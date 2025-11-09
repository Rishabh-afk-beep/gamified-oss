"""
Badge System - Track achievements
"""

# All available badges in the system
BADGES = {
    "first-steps": {
        "name": "First Steps",
        "description": "Complete your first quest",
        "icon": "🎯",
        "color": "#3498db",
        "category": "beginner",
        "criteria": {"type": "quest_count", "value": 1},
        "xp_reward": 50,
        "rare": False
    },
    
    "quest-completer": {
        "name": "Quest Completer",
        "description": "Complete 5 quests",
        "icon": "⭐",
        "color": "#2ecc71",
        "category": "quests",
        "criteria": {"type": "quest_count", "value": 5},
        "xp_reward": 150,
        "rare": False
    },
    
    "quest-master": {
        "name": "Quest Master",
        "description": "Complete 25 quests",
        "icon": "👑",
        "color": "#f39c12",
        "category": "quests",
        "criteria": {"type": "quest_count", "value": 25},
        "xp_reward": 500,
        "rare": True
    },
    
    "week-warrior": {
        "name": "Week Warrior",
        "description": "Maintain a 7-day streak",
        "icon": "🔥",
        "color": "#e74c3c",
        "category": "streak",
        "criteria": {"type": "streak_days", "value": 7},
        "xp_reward": 200,
        "rare": False
    },
    
    "month-master": {
        "name": "Month Master",
        "description": "Maintain a 30-day streak",
        "icon": "🌟",
        "color": "#9b59b6",
        "category": "streak",
        "criteria": {"type": "streak_days", "value": 30},
        "xp_reward": 1000,
        "rare": True
    },
    
    "century-club": {
        "name": "Century Club",
        "description": "Reach 1000 XP",
        "icon": "💯",
        "color": "#1abc9c",
        "category": "xp",
        "criteria": {"type": "total_xp", "value": 1000},
        "xp_reward": 100,
        "rare": False
    },
    
    "millionaire": {
        "name": "Millionaire",
        "description": "Reach 1,000,000 XP",
        "icon": "💰",
        "color": "#34495e",
        "category": "xp",
        "criteria": {"type": "total_xp", "value": 1000000},
        "xp_reward": 5000,
        "rare": True
    },
    
    "level-five": {
        "name": "Level 5 Achiever",
        "description": "Reach Level 5",
        "icon": "📈",
        "color": "#16a085",
        "category": "level",
        "criteria": {"type": "level", "value": 5},
        "xp_reward": 250,
        "rare": False
    },
    
    "level-ten": {
        "name": "Level 10 Legend",
        "description": "Reach Level 10",
        "icon": "🏆",
        "color": "#d35400",
        "category": "level",
        "criteria": {"type": "level", "value": 10},
        "xp_reward": 1000,
        "rare": True
    },
    
    "level-twenty": {
        "name": "Level 20 Master",
        "description": "Reach Level 20",
        "icon": "👸",
        "color": "#8e44ad",
        "category": "level",
        "criteria": {"type": "level", "value": 20},
        "xp_reward": 2500,
        "rare": True
    }
}


def get_all_badges() -> dict:
    """Get all badges in system"""
    return BADGES


def get_badge_info(badge_id: str) -> dict:
    """Get specific badge info"""
    return BADGES.get(badge_id, None)


def check_badges_earned(user: dict) -> list:
    """
    Check which badges user has earned based on their stats
    
    Args:
        user: User document from database
    
    Returns:
        List of badge IDs earned
    """
    earned = []
    
    for badge_id, badge_info in BADGES.items():
        criteria = badge_info["criteria"]
        met = False
        
        # Check quest count criteria
        if criteria["type"] == "quest_count":
            quests_completed = user.get("quests_completed", 0)
            if quests_completed >= criteria["value"]:
                met = True
        
        # Check streak days criteria
        elif criteria["type"] == "streak_days":
            current_streak = user.get("current_streak", 0)
            if current_streak >= criteria["value"]:
                met = True
        
        # Check total XP criteria
        elif criteria["type"] == "total_xp":
            total_xp = user.get("total_xp", 0)
            if total_xp >= criteria["value"]:
                met = True
        
        # Check level criteria
        elif criteria["type"] == "level":
            from app.utils.level_system import get_level_from_xp
            user_level = get_level_from_xp(user.get("total_xp", 0))
            if user_level >= criteria["value"]:
                met = True
        
        # Add to earned if criteria met
        if met:
            earned.append(badge_id)
    
    return earned


def get_new_badges(user: dict, previously_earned: list) -> list:
    """
    Get newly earned badges since last check
    
    Returns:
        List of NEW badge IDs just earned
    """
    currently_earned = check_badges_earned(user)
    new_badges = [b for b in currently_earned if b not in previously_earned]
    return new_badges
