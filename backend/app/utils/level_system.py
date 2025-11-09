"""
Level System - Calculate levels from XP
"""

def get_level_from_xp(total_xp: int) -> int:
    """
    Calculate player level from total XP
    
    Formula:
    Level 1: 0 - 999 XP
    Level 2: 1000 - 1999 XP
    Level 3: 2000 - 2999 XP
    ... and so on
    
    Each level requires 1000 XP
    """
    if total_xp < 0:
        return 1
    
    # Every 1000 XP = 1 level
    level = (total_xp // 1000) + 1
    
    # Maximum level 100
    return min(level, 100)


def get_xp_for_level(level: int) -> int:
    """
    Get total XP needed to reach a specific level
    
    Example:
    Level 1: 0 XP
    Level 2: 1000 XP
    Level 3: 2000 XP
    """
    if level <= 1:
        return 0
    return (level - 1) * 1000


def get_xp_progress(total_xp: int) -> dict:
    """
    Get progress towards next level
    
    Returns:
    {
        "current_level": 3,
        "current_xp": 2500,
        "level_start_xp": 2000,
        "level_end_xp": 3000,
        "progress_xp": 500,
        "needed_xp": 1000,
        "progress_percentage": 50.0
    }
    """
    current_level = get_level_from_xp(total_xp)
    current_level_xp = get_xp_for_level(current_level)
    next_level_xp = get_xp_for_level(current_level + 1)
    
    # XP earned in this level
    progress = total_xp - current_level_xp
    
    # XP needed to next level
    needed = next_level_xp - current_level_xp
    
    # Percentage complete
    percentage = (progress / needed) * 100 if needed > 0 else 0
    
    return {
        "current_level": current_level,
        "current_xp": total_xp,
        "level_start_xp": current_level_xp,
        "level_end_xp": next_level_xp,
        "progress_xp": progress,
        "needed_xp": needed,
        "progress_percentage": round(percentage, 1)
    }


def get_level_name(level: int) -> str:
    """Get rank name for level"""
    if level < 5:
        return "Novice"
    elif level < 10:
        return "Apprentice"
    elif level < 15:
        return "Practitioner"
    elif level < 20:
        return "Expert"
    elif level < 30:
        return "Master"
    else:
        return "Legendary"
