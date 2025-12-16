import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getUserHabits,
  toggleTodayCompletion,
  createHabit,
  deleteHabit,
} from "../services/habitsAPI";

import { formatDate, isCompletedToday } from "../utils/dateHelpers";

import { Plus } from "lucide-react";

import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import HabitCard from '../components/HabitCard';


import AchievementsPage from '../components/AchievementsPage';
import InsightsPage from '../components/InsightsPage';
import ScheduleSelector from '../components/ScheduleSelector';

import { skipHabitToday } from "../services/habitsAPI";




// ===================== MAIN DASHBOARD COMPONENT =====================
export default function Dashboard() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "General",
    startDate: new Date().toISOString().slice(0, 10),
    // NEW: Schedule fields
    frequency: 'daily',
    scheduledDays: [0, 1, 2, 3, 4, 5, 6],
    allowSkip: false
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

  const handleSkip = async (habit) => {
    const updated = await skipHabitToday(habit.id, habit);
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  };

  const stats = {
    total: habits.length,
    completed: habits.filter(h => isCompletedToday(h.lastCompletedDate)).length,
    maxStreak: habits.length > 0 ? Math.max(...habits.map(h => h.streakCount || 0)) : 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Navbar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="container mx-auto py-12 px-6 max-w-7xl">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <>
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
                {habits.length === 0 ? (
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
                        onSkip={handleSkip} 
                      />

                    ))}
                  </div>
                )}
              </>
            )}

            {/* INSIGHTS TAB */}
            {activeTab === 'insights' && <InsightsPage habits={habits} />}

            {/* ACHIEVEMENTS TAB */}
            {activeTab === 'achievements' && <AchievementsPage habits={habits} />}
          </>
        )}
      </div>

      {/* Add Habit Modal */}
 {showModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)' }}
  >
    {/* Overlay - Click to close */}
    <div 
      className="absolute inset-0" 
      onClick={() => setShowModal(false)}
    />
    
    {/* Modal Container */}
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200 animate-scaleIn"
    >
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-3xl px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-black text-white">Create New Habit</h3>
            <p className="text-white/80 text-sm mt-1">Build a new healthy routine</p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 hover:bg-white/20 rounded-2xl transition-all hover:scale-110 hover:rotate-90"
          >
            <span className="text-3xl text-white leading-none">×</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="space-y-6">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-700 font-bold mb-3">
              <span className="text-xl">📝</span>
              <h4 className="text-lg">Basic Information</h4>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Habit Name <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="e.g., Morning Meditation, Daily Exercise"
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-white"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="What does this habit mean to you? Why is it important?"
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-white h-24 resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Category
                </label>
                <select
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-white"
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
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-white"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200"></div>

          {/* Section 2: Schedule */}
          <div>
            <div className="flex items-center gap-2 text-slate-700 font-bold mb-4">
              <span className="text-xl">📅</span>
              <h4 className="text-lg">Schedule & Frequency</h4>
            </div>
            
            <ScheduleSelector
              value={{
                frequency: form.frequency,
                scheduledDays: form.scheduledDays,
                allowSkip: form.allowSkip
              }}
              onChange={(schedule) => setForm({ ...form, ...schedule })}
            />
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 bg-white rounded-b-3xl px-8 py-6 border-t border-slate-200">
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="bg-slate-200 hover:bg-slate-300 px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 text-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={!form.name || !form.description}
            className={`px-8 py-4 rounded-2xl shadow-lg font-bold transition-all ${
              !form.name || !form.description
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:scale-105 active:scale-95'
            }`}
          >
            {!form.name || !form.description ? 'Fill Required Fields' : '✨ Create Habit'}
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