
import { calculateInsights } from '../utils/calculateInsights';
import { getCategoryBreakdown } from '../utils/getCategoryBreakdown';

import WeeklyProductivityChart from '../components/WeeklyProductivityChart';



export default function InsightsPage({ habits }) {
  const insights = calculateInsights(habits);
  const categoryBreakdown = getCategoryBreakdown(habits);
  
  if (!insights) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
          <Lightbulb className="text-indigo-500" size={40} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">No insights yet</h3>
        <p className="text-slate-600">Create some habits to see your insights!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-6">📊 Your Habit Insights</h2>
      </div>
      
      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
          <p className="text-white/80 text-sm font-medium mb-1">Completion Rate</p>
          <p className="text-4xl font-black">{insights.completionRate}%</p>
          <p className="text-white/70 text-xs mt-2">Today's progress</p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
          <p className="text-white/80 text-sm font-medium mb-1">Average Streak</p>
          <p className="text-4xl font-black">{insights.avgStreak}</p>
          <p className="text-white/70 text-xs mt-2">Days per habit</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
          <p className="text-white/80 text-sm font-medium mb-1">Active Habits</p>
          <p className="text-4xl font-black">{insights.totalHabits}</p>
          <p className="text-white/70 text-xs mt-2">Total tracking</p>
        </div>
        
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
          <p className="text-white/80 text-sm font-medium mb-1">Top Category</p>
          <p className="text-2xl font-black">{insights.topCategory}</p>
          <p className="text-white/70 text-xs mt-2">Most focused on</p>
        </div>
      </div>
      
      {/* Weekly Chart */}
      <WeeklyProductivityChart habits={habits} />
      
      {/* Category Breakdown */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60">
        <h3 className="text-xl font-bold text-slate-900 mb-4">📈 Category Breakdown</h3>
        <div className="space-y-3">
          {categoryBreakdown.map(({ category, count, percentage }) => (
            <div key={category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-slate-700">{category}</span>
                <span className="text-slate-600">{count} habits ({percentage}%)</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}