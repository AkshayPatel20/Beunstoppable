import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Check, X } from 'lucide-react';
import { notificationService } from '../utils/notifications';

export default function NotificationSettings({ isOpen, onClose, habits, onSave, initialSettings }) {
  const [permission, setPermission] = useState(Notification.permission);
  const [settings, setSettings] = useState({
    enabled: false,
    dailyReminder: true,
    reminderTime: '09:00',
    beforeBedReminder: true,
    beforeBedTime: '21:00',
    motivationalMessages: true,
    streakAlerts: true,
    habitSpecificReminders: {}
  });

  // Load initial settings when they change
  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setPermission(Notification.permission);
    
    if (granted) {
      setSettings(prev => ({ ...prev, enabled: true }));
      notificationService.show('🎉 Notifications Enabled!', {
        body: 'You will now receive habit reminders'
      });
    }
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const handleHabitReminderToggle = (habitId) => {
    setSettings(prev => ({
      ...prev,
      habitSpecificReminders: {
        ...prev.habitSpecificReminders,
        [habitId]: {
          enabled: !prev.habitSpecificReminders[habitId]?.enabled,
          time: prev.habitSpecificReminders[habitId]?.time || '09:00'
        }
      }
    }));
  };

  const handleHabitReminderTime = (habitId, time) => {
    setSettings(prev => ({
      ...prev,
      habitSpecificReminders: {
        ...prev.habitSpecificReminders,
        [habitId]: {
          ...prev.habitSpecificReminders[habitId],
          time
        }
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200 animate-scaleIn">
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-3xl px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Bell className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white">Notifications</h3>
                <p className="text-white/80 text-sm mt-1">Manage your reminder settings</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-2xl transition-all hover:scale-110"
            >
              <X className="text-white" size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-6">
            {/* Permission Request */}
            {permission !== 'granted' && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Bell className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-amber-900 text-lg mb-2">Enable Notifications</h4>
                    <p className="text-amber-800 text-sm mb-4">
                      Get timely reminders to complete your habits and build consistency
                    </p>
                    <button
                      onClick={handleRequestPermission}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
                    >
                      Enable Notifications
                    </button>
                  </div>
                </div>
              </div>
            )}

            {permission === 'granted' && (
              <>
                {/* Master Toggle */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                        {settings.enabled ? <Bell className="text-white" size={24} /> : <BellOff className="text-white" size={24} />}
                      </div>
                      <div>
                        <div className="font-bold text-emerald-900 text-lg">Notifications Enabled</div>
                        <div className="text-emerald-700 text-sm">Receive all habit reminders</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enabled}
                      onChange={(e) => setSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="w-14 h-8 appearance-none bg-slate-300 rounded-full relative cursor-pointer transition-colors checked:bg-emerald-500 before:content-[''] before:absolute before:w-6 before:h-6 before:rounded-full before:bg-white before:top-1 before:left-1 before:transition-transform checked:before:translate-x-6"
                    />
                  </label>
                </div>

                {/* Global Settings */}
                {settings.enabled && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      <Clock size={20} className="text-indigo-600" />
                      Daily Reminders
                    </h4>

                    {/* Morning Reminder */}
                    <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-indigo-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🌅</span>
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">Morning Reminder</div>
                            <div className="text-xs text-slate-600">Start your day with habits</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.dailyReminder}
                          onChange={(e) => setSettings(prev => ({ ...prev, dailyReminder: e.target.checked }))}
                          className="w-12 h-7 appearance-none bg-slate-300 rounded-full relative cursor-pointer transition-colors checked:bg-indigo-500 before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-1 before:left-1 before:transition-transform checked:before:translate-x-5"
                        />
                      </div>
                      {settings.dailyReminder && (
                        <input
                          type="time"
                          value={settings.reminderTime}
                          onChange={(e) => setSettings(prev => ({ ...prev, reminderTime: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                        />
                      )}
                    </div>

                    {/* Evening Reminder */}
                    <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-purple-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🌙</span>
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">Evening Reminder</div>
                            <div className="text-xs text-slate-600">Complete before bed</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.beforeBedReminder}
                          onChange={(e) => setSettings(prev => ({ ...prev, beforeBedReminder: e.target.checked }))}
                          className="w-12 h-7 appearance-none bg-slate-300 rounded-full relative cursor-pointer transition-colors checked:bg-purple-500 before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-1 before:left-1 before:transition-transform checked:before:translate-x-5"
                        />
                      </div>
                      {settings.beforeBedReminder && (
                        <input
                          type="time"
                          value={settings.beforeBedTime}
                          onChange={(e) => setSettings(prev => ({ ...prev, beforeBedTime: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                        />
                      )}
                    </div>

                    {/* Additional Options */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">💬</span>
                          <span className="font-medium text-slate-900">Motivational Messages</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.motivationalMessages}
                          onChange={(e) => setSettings(prev => ({ ...prev, motivationalMessages: e.target.checked }))}
                          className="w-12 h-7 appearance-none bg-slate-300 rounded-full relative cursor-pointer transition-colors checked:bg-indigo-500 before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-1 before:left-1 before:transition-transform checked:before:translate-x-5"
                        />
                      </label>

                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🔥</span>
                          <span className="font-medium text-slate-900">Streak Alerts</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.streakAlerts}
                          onChange={(e) => setSettings(prev => ({ ...prev, streakAlerts: e.target.checked }))}
                          className="w-12 h-7 appearance-none bg-slate-300 rounded-full relative cursor-pointer transition-colors checked:bg-orange-500 before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-1 before:left-1 before:transition-transform checked:before:translate-x-5"
                        />
                      </label>
                    </div>

                    {/* Per-Habit Reminders */}
                    {habits && habits.length > 0 && (
                      <>
                        <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2 mt-6">
                          <Bell size={20} className="text-indigo-600" />
                          Individual Habit Reminders
                        </h4>

                        <div className="space-y-3">
                          {habits.map(habit => (
                            <div key={habit.id} className="bg-white rounded-2xl p-4 border-2 border-slate-200">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="font-semibold text-slate-900">{habit.name}</div>
                                  <div className="text-xs text-slate-600">{habit.description}</div>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={settings.habitSpecificReminders[habit.id]?.enabled || false}
                                  onChange={() => handleHabitReminderToggle(habit.id)}
                                  className="w-12 h-7 appearance-none bg-slate-300 rounded-full relative cursor-pointer transition-colors checked:bg-indigo-500 before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-1 before:left-1 before:transition-transform checked:before:translate-x-5"
                                />
                              </div>
                              {settings.habitSpecificReminders[habit.id]?.enabled && (
                                <input
                                  type="time"
                                  value={settings.habitSpecificReminders[habit.id]?.time || '09:00'}
                                  onChange={(e) => handleHabitReminderTime(habit.id, e.target.value)}
                                  className="w-full px-4 py-2 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-white rounded-b-3xl px-8 py-6 border-t border-slate-200">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-8 py-4 rounded-2xl font-bold bg-slate-200 hover:bg-slate-300 transition-all hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <Check size={20} className="inline mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}