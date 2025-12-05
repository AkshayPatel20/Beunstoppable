import { useState, useEffect, useRef } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function ProfileMenu({ user }) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative overflow-visible">
      <img
        src={user.photoURL}
        className="w-11 h-11 rounded-full cursor-pointer shadow-lg
                   ring-2 ring-white/40 dark:ring-slate-700
                   transition-all duration-300 hover:scale-105 
                   hover:ring-blue-400"
        onClick={() => setOpen((prev) => !prev)}
      />

      {open && (
        <div
          className="absolute right-0 mt-3 w-52 p-4 
                     z-[9999]                             /* IMPORTANT */
                     rounded-2xl shadow-2xl backdrop-blur-xl
                     bg-white/20 dark:bg-slate-800/30
                     border border-white/40 dark:border-slate-700/40
                     animate-fade-slide"
        >
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {user.displayName}
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-300 opacity-80">
            {user.email}
          </div>

          <div className="my-3 h-px bg-gradient-to-r from-transparent via-slate-400/40 to-transparent"></div>

          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl 
                       text-sm font-medium
                       bg-white/30 dark:bg-slate-700/40
                       hover:bg-white/50 dark:hover:bg-slate-700/60
                       shadow-sm transition-all duration-200
                       text-slate-900 dark:text-slate-100"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
