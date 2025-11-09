/**
 * Mock User Data
 * This is the demo user data for testing
 */

export const mockUser = {
  id: '507f1f77bcf86cd799439011',
  username: 'demo_user',
  email: 'demo@example.com',
  level: 3,
  total_xp: 2250,
  current_streak: 5,
  longest_streak: 12,
  quests_completed: 22,
  badges: ['first-steps', 'quest-completer', 'week-warrior', 'century-club'],
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo_user',
  created_at: '2025-01-01T00:00:00',
  member_since: 5
};

/**
 * Get level name from level number
 */
export function getLevelName(level) {
  if (level < 5) return 'Novice';
  if (level < 10) return 'Apprentice';
  if (level < 15) return 'Practitioner';
  if (level < 20) return 'Expert';
  if (level < 30) return 'Master';
  return 'Legendary';
}

/**
 * Get progress percentage to next level
 */
export function getProgressPercentage(totalXP) {
  const currentLevelXP = (Math.floor(totalXP / 1000)) * 1000;
  const nextLevelXP = currentLevelXP + 1000;
  const progress = totalXP - currentLevelXP;
  return Math.round((progress / 1000) * 100);
}

/**
 * Get current level from XP
 */
export function getLevelFromXP(totalXP) {
  return Math.floor(totalXP / 1000) + 1;
}
