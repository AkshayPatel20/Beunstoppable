import { isCompletedToday } from "../utils/dateHelpers";

export const calculateInsights = (habits) => {
  if (habits.length === 0) return null;
  
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => isCompletedToday(h.lastCompletedDate)).length;
  const avgStreak = habits.reduce((sum, h) => sum + (h.streakCount || 0), 0) / totalHabits;
  
  const categoryCount = habits.reduce((acc, h) => {
    acc[h.category] = (acc[h.category] || 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
  
  const completionRate = ((completedToday / totalHabits) * 100).toFixed(0);
  
  return {
    totalHabits,
    completedToday,
    avgStreak: avgStreak.toFixed(1),
    topCategory: topCategory[0],
    completionRate
  };
};
