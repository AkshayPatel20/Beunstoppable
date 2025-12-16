
import React, { useEffect, useState } from "react";
import { Plus, MoreVertical, Flame } from "lucide-react";

import { formatDate, isCompletedToday } from "../utils/dateHelpers";
import { formatFrequency, isScheduledToday, isSkippedToday, getNextScheduledDate } from '../utils/dateHelpers';

// ---------------------- HABIT CARD ----------------------
export default function HabitCard({ habit, onToggle, onDelete }) {
  const completed = isCompletedToday(habit.lastCompletedDate);
  const [showMenu, setShowMenu] = useState(false);

  const categoryColors = {
    General: { bg: "from-slate-400 to-slate-600", glow: "from-slate-400/20 to-slate-600/20" },
    Health: { bg: "from-emerald-400 to-teal-600", glow: "from-emerald-400/20 to-teal-600/20" },
    Learning: { bg: "from-blue-400 to-indigo-600", glow: "from-blue-400/20 to-indigo-600/20" },
    Work: { bg: "from-orange-400 to-red-600", glow: "from-orange-400/20 to-red-600/20" },
  };

  const colors = categoryColors[habit.category] || categoryColors.General;

  const scheduledToday = isScheduledToday(habit);
  const skippedToday = isSkippedToday(habit);


  return (
    <div className="group relative animate-fadeIn">
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.glow} rounded-3xl blur-xl group-hover:blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500`} />
      
      <div className="relative p-7 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r ${colors.bg} shadow-md`}>
                {habit.category}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1 leading-tight">{habit.name}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{habit.description}</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2.5 hover:bg-red-50 rounded-2xl transition-all duration-200 hover:scale-110 hover:rotate-90"
            >
              <MoreVertical className="text-slate-400 hover:text-red-500 transition-colors" size={18} />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-20 animate-slideDown">
                  <button
                    onClick={() => {
                      onDelete(habit.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
                  >
                    🗑️ Delete Habit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r ${colors.bg} shadow-md`}>
            {habit.category}
          </span>
          
          {/* NEW: Schedule Badge */}
          {habit.frequency !== 'daily' && (
            <span className="px-3 py-1 text-xs font-bold bg-slate-200 text-slate-700 rounded-full">
              📅 {formatFrequency(habit)}
            </span>
          )}
          
          {!scheduledToday && (
            <span className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded-full">
              ⏸️ Not today
            </span>
          )}
          
          {skippedToday && (
            <span className="px-3 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-full">
              ⏭️ Skipped
            </span>
          )}
        </div>


        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-sm hover:scale-105 transition-transform">
            <Flame className="text-orange-500" size={20} />
            <div>
              <p className="text-xs text-slate-600 font-medium">Streak</p>
              <p className="text-lg font-bold text-slate-900">{habit.streakCount || 0} days</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm hover:scale-105 transition-transform">
            <span className="text-indigo-500 text-xl">📅</span>
            <div>
              <p className="text-xs text-slate-600 font-medium">Last Done</p>
              <p className="text-sm font-semibold text-slate-900">{formatDate(habit.lastCompletedDate)}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span className="font-medium flex items-center gap-1">
              🎯 Progress to 30 days
            </span>
            <span className="font-bold">{Math.min(habit.streakCount || 0, 30)}/30</span>
          </div>
          <div className="relative w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div
              className={`h-full bg-gradient-to-r ${colors.bg} rounded-full shadow-lg transition-all duration-1000 ease-out relative`}
              style={{ width: `${Math.min(((habit.streakCount || 0) / 30) * 100, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onToggle(habit)}
          disabled={!scheduledToday && !skippedToday}
          className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all duration-300 relative overflow-hidden ${
            !scheduledToday && !skippedToday
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-50'
              : completed
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-200 hover:shadow-emerald-300"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {!scheduledToday && !skippedToday ? (
            <>📅 Next: {getNextScheduledDate(habit)}</>
          ) : completed ? (
            "🏆 Completed Today"
          ) : (
            <><Plus size={20} />Mark as Complete</>
          )}
        </span>
        </button>


      {scheduledToday && !completed && !skippedToday && habit.allowSkip && (
        <button
          onClick={() => onSkip(habit)}
          className="w-full mt-2 py-3 rounded-2xl font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all"
        >
          ⏭️ Skip Today
        </button>

        )}
      </div>
    </div>
  );
}
