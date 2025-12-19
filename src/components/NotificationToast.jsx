import React, { useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';

export default function NotificationToast({ notification, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <Check className="text-emerald-600" size={24} />;
      case 'reminder': return <Bell className="text-indigo-600" size={24} />;
      default: return <Bell className="text-indigo-600" size={24} />;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'success': return 'from-emerald-500 to-teal-500';
      case 'reminder': return 'from-indigo-500 to-purple-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="fixed top-24 right-6 z-[9999] animate-slideInRight">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-5 min-w-[320px] max-w-md">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColors()} flex items-center justify-center flex-shrink-0`}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-900 mb-1">{notification.title}</h4>
            <p className="text-sm text-slate-600">{notification.message}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
