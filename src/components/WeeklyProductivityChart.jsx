import { calculateWeeklyData } from '../utils/calculateWeeklyData';

import { BarChart3 } from "lucide-react";


export default function WeeklyProductivityChart({ habits }) {
  const weekData = calculateWeeklyData(habits);
  const maxCompleted = Math.max(...weekData.map(d => d.completed), 1);
  
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="text-indigo-600" size={24} />
        <h3 className="text-xl font-bold text-slate-900">Weekly Productivity</h3>
      </div>
      
      <div className="flex items-end justify-between gap-3 h-48">
        {weekData.map((day, idx) => {
          const height = (day.completed / maxCompleted) * 100;
          const isToday = idx === 6;
          
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center justify-end h-40">
                <div className="text-xs font-bold text-slate-700 mb-1">
                  {day.completed}
                </div>
                <div
                  className={`w-full rounded-t-xl transition-all duration-500 ${
                    isToday
                      ? 'bg-gradient-to-t from-indigo-600 to-purple-600 shadow-lg'
                      : 'bg-gradient-to-t from-indigo-400 to-purple-400'
                  }`}
                  style={{ height: `${height}%`, minHeight: day.completed > 0 ? '20px' : '0' }}
                />
              </div>
              <div className={`text-xs font-semibold ${isToday ? 'text-indigo-600' : 'text-slate-600'}`}>
                {day.day}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-sm text-slate-600">
          🎯 You've completed <span className="font-bold text-indigo-600">{weekData.reduce((sum, d) => sum + d.completed, 0)}</span> habits this week!
        </p>
      </div>
    </div>
  );
}