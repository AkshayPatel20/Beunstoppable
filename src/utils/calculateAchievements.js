import { isCompletedToday } from "../utils/dateHelpers";

export 
const calculateAchievements = (habits) => {
  const totalHabits = habits.length;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streakCount || 0)) : 0;
  const completedToday = habits.filter(h => isCompletedToday(h.lastCompletedDate)).length;
  const uniqueCategories = new Set(habits.map(h => h.category)).size;
  
  const badges = [
    { id: 1, name: "First Step", icon: "🎯", description: "Create your first habit", unlocked: totalHabits >= 1 },
    { id: 2, name: "Habit Builder", icon: "🏗️", description: "Create 5 habits", unlocked: totalHabits >= 5 },
    { id: 3, name: "Consistency King", icon: "👑", description: "Reach a 7-day streak", unlocked: maxStreak >= 7 },
    { id: 4, name: "On Fire!", icon: "🔥", description: "Reach a 30-day streak", unlocked: maxStreak >= 30 },
    { id: 5, name: "Perfect Day", icon: "⭐", description: "Complete all habits in one day", unlocked: completedToday === totalHabits && totalHabits > 0 },
    { id: 6, name: "Week Warrior", icon: "💪", description: "Complete habits 7 days in a row", unlocked: maxStreak >= 7 },
    { id: 7, name: "Habit Master", icon: "🏆", description: "Reach a 100-day streak", unlocked: maxStreak >= 100 },
    { id: 8, name: "Diverse Goals", icon: "🌈", description: "Create habits in 3+ categories", unlocked: uniqueCategories >= 3 }
  ];
  
  return badges;
};