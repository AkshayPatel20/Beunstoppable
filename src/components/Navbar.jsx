import React, { useEffect, useEffectEvent, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Navbar({ user,activeTab, setActiveTab }) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [profileImage, setProfileImage] = useState(""); // ✅ image state

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

 // ✅ Update profile image when user changes
  useEffect(() => {
    if (user?.photoURL) {
      setProfileImage(user.photoURL);
    } else {
      setProfileImage("/avatar.png"); // fallback image (public folder)
    }
    console.log(user.photoURL);
  }, [user]);

  return (
    <div className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-2xl">
      <nav className="container mx-auto py-5 px-6 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Be Unstoppable
          </h1>
        </div>

          
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
              {tab.label}
            </button>
          ))}
        </div>


        {/* PROFILE */}
        <div className="relative" ref={menuRef}>
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-4 cursor-pointer"
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
              className="w-12 h-12 rounded-2xl border-2 border-white/30 
                         shadow-xl ring-2 ring-white/20 
                         hover:scale-105 transition-transform"
            />
          </div>

          {/* DROPDOWN */}
          {open && (
            <div
              className="absolute right-0 mt-4 w-56 rounded-2xl 
                         bg-white/80 dark:bg-slate-900/90 
                         backdrop-blur-xl shadow-2xl border border-white/30
                         animate-in fade-in slide-in-from-top-2 z-[9999]"
            >
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {user.displayName}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3
                           text-red-600 hover:bg-red-50
                           dark:hover:bg-red-900/20
                           rounded-b-2xl transition"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}

          
        </div>
      </nav>
    </div>
  );
}
