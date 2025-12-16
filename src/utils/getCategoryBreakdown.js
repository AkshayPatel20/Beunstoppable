export const getCategoryBreakdown = (habits) => {
  if (habits.length === 0) return [];
  
  const categoryStats = habits.reduce((acc, h) => {
    if (!acc[h.category]) {
      acc[h.category] = { count: 0 };
    }
    acc[h.category].count += 1;
    return acc;
  }, {});
  
  return Object.entries(categoryStats).map(([category, stats]) => ({
    category,
    count: stats.count,
    percentage: ((stats.count / habits.length) * 100).toFixed(0)
  }));
};
