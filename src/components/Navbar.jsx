// ==================== PROBLEM & SOLUTION ====================

/*
❌ PROBLEM:
- Settings save to Firestore ✓
- But don't load on page refresh ✗
- NotificationSettings component doesn't receive initialSettings

✅ SOLUTION:
1. Load settings from Firestore in Navbar (parent)
2. Pass settings to NotificationSettings component
3. Component uses those settings as initial state
*/


// ==================== STEP 1: Update Navbar.jsx ====================

import React, { useEffect, useRef, useState } from "react";
import { LogOut, Bell } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import NotificationSettings from '../components/NotificationSettings';
import NotificationToast from '../components/NotificationToast';
import { notificationService } from '../utils/notifications';
import { getNotificationSettings, saveNotificationSettings } from '../services/habitsAPI';

export default function Navbar({ user, activeTab, setActiveTab, habits = [] }) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [profileImage, setProfileImage] = useState("");
 
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [toast, setToast] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true); // ✅ NEW: Track loading state

  // ✅ FIXED: Load notification settings from Firestore
  useEffect(() => {
    if (!user) {
      setSettingsLoading(false);
      return;
    }

    (async () => {
      try {
        console.log('📥 Loading notification settings for user:', user.uid);
        
        // Fetch from Firestore
        const settings = await getNotificationSettings(user.uid);
        
        console.log('✅ Loaded settings:', settings);
        
        setNotificationSettings(settings);
        
        // Request browser permission if settings say enabled
        if (settings.enabled && Notification.permission !== 'granted') {
          console.log('🔔 Settings enabled, requesting browser permission...');
          await notificationService.requestPermission();
        }
        
        setSettingsLoading(false);
      } catch (error) {
        console.error('❌ Error loading notification settings:', error);
        setSettingsLoading(false);
      }
    })();
  }, [user]);

  // Check reminders every minute
  useEffect(() => {
    if (!notificationSettings?.enabled || habits.length === 0) return;

    const checkReminders = () => {
      notificationService.checkDailyReminders(habits, notificationSettings);
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [habits, notificationSettings]);

  const showToast = (title, message, type = 'reminder') => {
    setToast({ title, message, type });
  };

  // ✅ FIXED: Save and update state
  const handleNotificationSave = async (settings) => {
    try {
      console.log('💾 Saving notification settings:', settings);
      
      // Save to Firestore
      await saveNotificationSettings(user.uid, settings);
      
      // Update local state immediately
      setNotificationSettings({ ...settings, userId: user.uid });
      
      console.log('✅ Settings saved successfully');
      
      showToast('Settings Saved', 'Your notification preferences have been updated', 'success');
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      showToast('Error', 'Failed to save settings', 'error');
    }
  };
    
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update profile image when user changes
  useEffect(() => {
    if (user?.photoURL) {
      setProfileImage(user.photoURL);
    } else {
      setProfileImage("/avatar.png");
    }
  }, [user]);

  return (
    <>
      <div className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-2xl">
        <nav className="container mx-auto py-5 px-6">
          <div className="flex items-center justify-between mb-4">
            {/* LOGO */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">✨</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                Be Unstoppable
              </h1>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <button
                onClick={() => setShowNotificationSettings(true)}
                className="relative p-3 bg-white/20 backdrop-blur-xl rounded-2xl hover:bg-white/30 transition-all hover:scale-105"
                title="Notification Settings"
              >
                <Bell className="text-white" size={22} />
                {/* ✅ FIXED: Show green dot when enabled */}
                {notificationSettings?.enabled && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>

              {/* PROFILE */}
              <div className="relative" ref={menuRef}>
                <div
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-white/90 text-sm font-medium">
                      {user.displayName}
                    </p>
                    <p className="text-white/60 text-xs">
                      Keep building! 🚀
                    </p>
                  </div>

                  <img
                    src={profileImage}
                    alt="avatar"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-2xl border-2 border-white/30 shadow-xl ring-2 ring-white/20 hover:scale-105 transition-transform"
                  />
                </div>

                {/* DROPDOWN */}
                {open && (
                  <div className="absolute right-0 mt-4 w-56 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl border border-white/30 z-[9999] animate-slideDown">
                    <div className="px-4 py-3 border-b border-slate-200">
                      <p className="text-sm font-semibold text-slate-800">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-slate-600 truncate">
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-2xl transition"
                    >
                      <LogOut size={18} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
              { id: 'insights', label: 'Insights', icon: '📊' },
              { id: 'achievements', label: 'Achievements', icon: '🏆' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/30 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* ✅ FIXED: Pass initialSettings prop */}
      <NotificationSettings
        isOpen={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
        habits={habits}
        onSave={handleNotificationSave}
        initialSettings={notificationSettings}  // ✅ This was missing or not working!
      />

      {/* Toast Notification */}
      {toast && (
        <NotificationToast
          notification={toast}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

