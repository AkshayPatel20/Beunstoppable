import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getUserHabits,
  toggleTodayCompletion,
  createHabit,
  deleteHabit,
} from "../services/habitsAPI";
import { formatDate, isCompletedToday } from "../utils/dateHelpers";
import { Plus, MoreVertical, Flame } from "lucide-react";

import Navbar from '../components/Navbar';


// ---------------------- STATS CARD ----------------------
function StatsCard({ icon, label, value, gradient }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center shadow-lg text-2xl`}>
          {icon}
        </div>
        <div>
          <p className="text-slate-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------- HABIT CARD ----------------------
function HabitCard({ habit, onToggle, onDelete }) {
  const completed = isCompletedToday(habit.lastCompletedDate);
  const [showMenu, setShowMenu] = useState(false);

  const categoryColors = {
    General: { bg: "from-slate-400 to-slate-600", glow: "from-slate-400/20 to-slate-600/20" },
    Health: { bg: "from-emerald-400 to-teal-600", glow: "from-emerald-400/20 to-teal-600/20" },
    Learning: { bg: "from-blue-400 to-indigo-600", glow: "from-blue-400/20 to-indigo-600/20" },
    Work: { bg: "from-orange-400 to-red-600", glow: "from-orange-400/20 to-red-600/20" },
  };

  const colors = categoryColors[habit.category] || categoryColors.General;

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
          className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all duration-300 relative overflow-hidden hover:scale-[1.02] active:scale-[0.98] ${
            completed
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-200 hover:shadow-emerald-300"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-200 hover:shadow-xl"
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {completed ? (
              <>
                🏆 Completed Today
              </>
            ) : (
              <>
                <Plus size={20} />
                Mark as Complete
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}

// ---------------------- MAIN DASHBOARD ----------------------
export default function Dashboard() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "General",
    startDate: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (!user) return;

    (async () => {
      const list = await getUserHabits(user.uid);
      setHabits(list);
      setLoading(false);
    })();
  }, [user]);

  const handleToggle = async (habit) => {
    const updated = await toggleTodayCompletion(habit);
    setHabits((prev) =>
      prev.map((h) => (h.id === updated.id ? updated : h))
    );
  };

  const handleCreate = async () => {
    if (!form.name || !form.description) return;
    await createHabit({ userId: user.uid, ...form });
    const list = await getUserHabits(user.uid);
    setHabits(list);
    setShowModal(false);
    setForm({
      name: "",
      description: "",
      category: "General",
      startDate: new Date().toISOString().slice(0, 10),
    });
  };

  const handleDelete = async (id) => {
    await deleteHabit(id);
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const stats = {
    total: habits.length,
    completed: habits.filter(h => isCompletedToday(h.lastCompletedDate)).length,
    maxStreak: habits.length > 0 ? Math.max(...habits.map(h => h.streakCount || 0)) : 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Navbar user={user} />

      <div className="container mx-auto py-12 px-6 max-w-7xl">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fadeIn">
          <StatsCard 
            icon="🎯" 
            label="Total Habits" 
            value={stats.total} 
            gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
          />
          <StatsCard 
            icon="📈" 
            label="Done Today" 
            value={stats.completed} 
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <StatsCard 
            icon="🔥" 
            label="Best Streak" 
            value={stats.maxStreak} 
            gradient="bg-gradient-to-br from-orange-500 to-red-600"
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fadeIn">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-2">My Habits</h2>
            <p className="text-slate-600 text-lg">Build consistency, one day at a time ✨</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl shadow-xl flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={22} /> New Habit
          </button>
        </div>

        {/* Habits Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-20 animate-fadeIn">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl animate-float">
              <span className="text-5xl">✨</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No habits yet</h3>
            <p className="text-slate-600 mb-6">Start your journey by creating your first habit!</p>
            <button
              onClick={() => setShowModal(true)}
              className="py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Habit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/50 z-50 p-4 animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl max-w-lg w-full border border-white/60 animate-scaleIn"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-black text-slate-900">Create New Habit</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-2xl transition-all hover:scale-110 hover:rotate-90"
              >
                <span className="text-2xl text-slate-600">×</span>
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Habit Name</label>
                <input
                  placeholder="e.g., Morning Meditation"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-white/80"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea
                  placeholder="What does this habit mean to you?"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-white/80 h-28 resize-none"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-white/80"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option>General</option>
                    <option>Health</option>
                    <option>Learning</option>
                    <option>Work</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-white/80"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-slate-200 hover:bg-slate-300 px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreate}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-2xl shadow-lg font-bold transition-all hover:scale-105 active:scale-95"
                >
                  Create Habit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}