// ===================== UTILITIES =====================
export const calculateWeeklyData = (habits) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const weekData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);
    
    const completed = habits.filter(h => {
      const lastCompleted = h.lastCompletedDate?.slice(0, 10);
      return lastCompleted === dateStr;
    }).length;
    
    weekData.push({
      day: days[date.getDay()],
      date: dateStr,
      completed,
      total: habits.length
    });
  }
  
  return weekData;
};

