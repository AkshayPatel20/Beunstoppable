import React, { useState } from "react";
import { Plus, MoreVertical, Flame } from "lucide-react";
import { formatDate, isCompletedToday, isScheduledToday, isSkippedToday, getNextScheduledDate, formatFrequency } from '../utils/dateHelpers';

export default function HabitCard({ habit, onToggle, onDelete, onSkip, onUnskip }) {
  const completed = isCompletedToday(habit.lastCompletedDate);
  const [showMenu, setShowMenu] = useState(false);

  // Check scheduling status
  const scheduledToday = isScheduledToday(habit);
  const skippedToday = isSkippedToday(habit);

  const categoryColors = {
    General: { bg: "from-slate-400 to-slate-600", glow: "from-slate-400/20 to-slate-600/20" },
    Health: { bg: "from-emerald-400 to-teal-600", glow: "from-emerald-400/20 to-teal-600/20" },
    Learning: { bg: "from-blue-400 to-indigo-600", glow: "from-blue-400/20 to-indigo-600/20" },
    Work: { bg: "from-orange-400 to-red-600", glow: "from-orange-400/20 to-red-600/20" },
  };

  const colors = categoryColors[habit.category] || categoryColors.General;

  return (
    <div className="group relative animate-fadeIn h-full">
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.glow} rounded-3xl blur-xl group-hover:blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500`} />
      
      {/* Card Container - Fixed Height Structure */}
      <div className="relative h-full flex flex-col p-6 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        
        {/* Header Section - Fixed Height */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-h-[100px]">
            {/* Badges - Fixed Height Container */}
            <div className="flex flex-wrap items-center gap-2 mb-3 min-h-[28px]">
              <span className={`px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r ${colors.bg} shadow-md`}>
                {habit.category}
              </span>
              
              {habit.frequency !== 'daily' && (
                <span className="basis-full px-3 py-1 text-xs font-bold bg-slate-200 text-slate-700 rounded-full">
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

            {/* Title - Fixed Height */}
            <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight line-clamp-2 min-h-[56px]">
              {habit.name}
            </h3>
            
            {/* Description - Fixed Height with Ellipsis */}
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
              {habit.description}
            </p>
          </div>

          {/* Menu Button - Fixed Position */}
          <div className="relative ml-3">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <MoreVertical className="text-slate-400 hover:text-red-500 transition-colors" size={18} />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-20 animate-slideDown">
                  <button
                    onClick={() => { onDelete(habit.id); setShowMenu(false); }}
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
                  >
                    🗑️ Delete Habit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats Section - Fixed Height & Centered */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Streak Stat */}
          <div className="flex flex-col items-center justify-center text-center px-3 py-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-sm hover:scale-105 transition-transform min-h-[88px]">
            <Flame className="text-orange-500 mb-2" size={24} />
            <p className="text-xs text-slate-600 font-medium mb-1">Streak</p>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-slate-900 leading-none">{habit.streakCount || 0}</span>
              <span className="text-xs text-slate-600 mt-1">days</span>
            </div>
          </div>
          
          {/* Last Done Stat */}
          <div className="flex flex-col items-center justify-center text-center px-3 py-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm hover:scale-105 transition-transform min-h-[88px]">
            <span className="text-2xl mb-2">📅</span>
            <p className="text-xs text-slate-600 font-medium mb-1">Last Done</p>
            <p className="text-xs font-bold text-slate-900">{formatDate(habit.lastCompletedDate)}</p>
          </div>
        </div>

        {/* Progress Section - Fixed Height */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span className="font-medium">🎯 Progress to 30 days</span>
            <span className="font-bold">{Math.min(habit.streakCount || 0, 30)}/30</span>
          </div>
          <div className="relative w-full bg-slate-200/80 rounded-full h-2 overflow-hidden shadow-inner">
            <div
              className={`h-full bg-gradient-to-r ${colors.bg} rounded-full shadow-lg transition-all duration-1000 ease-out relative`}
              style={{ width: `${Math.min(((habit.streakCount || 0) / 30) * 100, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Spacer to push buttons to bottom */}
        <div className="flex-grow" />

        {/* Action Buttons - Fixed at Bottom */}
        <div className="space-y-2 mt-auto">
          {/* Main Completion Button */}
          <button
            onClick={() => onToggle(habit)}
            disabled={!scheduledToday || skippedToday}
            className={`w-full py-3.5 rounded-xl font-bold shadow-md transition-all duration-300 text-sm ${
              !scheduledToday || skippedToday
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                : completed
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-200 hover:shadow-emerald-300 hover:scale-[1.02]"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {!scheduledToday ? (
                <span className="truncate">📅 Next: {getNextScheduledDate(habit)}</span>
              ) : skippedToday ? (
                "⏭️ Skipped Today"
              ) : completed ? (
                "🏆 Completed Today"
              ) : (
                <><Plus size={18} />Mark as Complete</>
              )}
            </span>
          </button>

          {/* Skip Button */}
          {scheduledToday && !completed && !skippedToday && habit.allowSkip && onSkip && (
            <button
              onClick={() => onSkip(habit)}
              className="w-full py-2.5 rounded-xl font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
            >
              ⏭️ Skip Today
            </button>
          )}

          {/* Unskip Button */}
          {skippedToday && onUnskip && (
            <button
              onClick={() => onUnskip(habit)}
              className="w-full py-2.5 rounded-xl font-semibold bg-blue-200 hover:bg-blue-300 text-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
            >
              ↩️ Unskip Today
            </button>
          )}
        </div>
      </div>
    </div>
  );
}