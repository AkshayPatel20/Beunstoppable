import React, { useState } from 'react';
import { Calendar, Repeat } from 'lucide-react';

export default function ScheduleSelector({ value, onChange }) {
  const [frequency, setFrequency] = useState(value?.frequency || 'daily');
  const [scheduledDays, setScheduledDays] = useState(value?.scheduledDays || [0, 1, 2, 3, 4, 5, 6]);
  const [allowSkip, setAllowSkip] = useState(value?.allowSkip || false);

  const days = [
    { id: 0, label: 'S', full: 'Sunday' },
    { id: 1, label: 'M', full: 'Monday' },
    { id: 2, label: 'T', full: 'Tuesday' },
    { id: 3, label: 'W', full: 'Wednesday' },
    { id: 4, label: 'T', full: 'Thursday' },
    { id: 5, label: 'F', full: 'Friday' },
    { id: 6, label: 'S', full: 'Saturday' },
  ];

  const handleFrequencyChange = (newFrequency) => {
    setFrequency(newFrequency);
    
    if (newFrequency === 'daily') {
      const updated = { frequency: 'daily', scheduledDays: [0, 1, 2, 3, 4, 5, 6], allowSkip };
      onChange(updated);
    } else if (newFrequency === 'weekly') {
      const updated = { frequency: 'weekly', scheduledDays, allowSkip };
      onChange(updated);
    }
  };

  const toggleDay = (dayId) => {
    const newDays = scheduledDays.includes(dayId)
      ? scheduledDays.filter(d => d !== dayId)
      : [...scheduledDays, dayId].sort();
    
    setScheduledDays(newDays);
    onChange({ frequency, scheduledDays: newDays, allowSkip });
  };

  const selectPreset = (preset) => {
    let days = [];
    if (preset === 'weekdays') days = [1, 2, 3, 4, 5];
    if (preset === 'weekend') days = [0, 6];
    if (preset === 'all') days = [0, 1, 2, 3, 4, 5, 6];
    
    setScheduledDays(days);
    onChange({ frequency, scheduledDays: days, allowSkip });
  };

  const handleAllowSkipChange = (newValue) => {
    setAllowSkip(newValue);
    onChange({ frequency, scheduledDays, allowSkip: newValue });
  };

  return (
    <div className="space-y-4">
      {/* Frequency Selection - Compact */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleFrequencyChange('daily')}
          className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
            frequency === 'daily'
              ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            frequency === 'daily' ? 'bg-indigo-100' : 'bg-slate-100'
          }`}>
            <Repeat size={20} />
          </div>
          <div className="text-left">
            <div className="font-bold text-sm">Daily</div>
            <div className="text-xs text-slate-600">Every day</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleFrequencyChange('weekly')}
          className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
            frequency === 'weekly'
              ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            frequency === 'weekly' ? 'bg-indigo-100' : 'bg-slate-100'
          }`}>
            <Calendar size={20} />
          </div>
          <div className="text-left">
            <div className="font-bold text-sm">Weekly</div>
            <div className="text-xs text-slate-600">Select days</div>
          </div>
        </button>
      </div>

      {/* Weekly Day Selection - Compact */}
      {frequency === 'weekly' && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          {/* Quick Presets */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => selectPreset('weekdays')}
              className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            >
              Mon-Fri
            </button>
            <button
              type="button"
              onClick={() => selectPreset('weekend')}
              className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            >
              Sat-Sun
            </button>
            <button
              type="button"
              onClick={() => selectPreset('all')}
              className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            >
              All Days
            </button>
          </div>

          {/* Day Buttons - Compact */}
          <div className="grid grid-cols-7 gap-2">
            {days.map(day => (
              <button
                key={day.id}
                type="button"
                onClick={() => toggleDay(day.id)}
                className={`aspect-square rounded-lg font-bold text-sm transition-all ${
                  scheduledDays.includes(day.id)
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md scale-105'
                    : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
                title={day.full}
              >
                {day.label}
              </button>
            ))}
          </div>

          {scheduledDays.length === 0 && (
            <p className="text-xs text-red-500 mt-2 font-medium">⚠️ Select at least one day</p>
          )}
        </div>
      )}

      {/* Allow Skip Option - Compact */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={allowSkip}
            onChange={(e) => handleAllowSkipChange(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-blue-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <div className="flex-1">
            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span>⏭️</span>
              Allow Skipping
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Skip scheduled days without breaking your streak
            </div>
          </div>
        </label>
      </div>

      {/* Schedule Summary - Compact */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
        <div className="flex items-start gap-2">
          <span className="text-lg">📋</span>
          <div className="flex-1">
            <div className="font-bold text-sm text-indigo-900 mb-1">Schedule Summary</div>
            <div className="text-xs text-slate-700">
              {frequency === 'daily' && '✓ This habit will be scheduled every day'}
              {frequency === 'weekly' && scheduledDays.length > 0 && (
                <>
                  ✓ Scheduled on: <span className="font-semibold">{days.filter(d => scheduledDays.includes(d.id)).map(d => d.full).join(', ')}</span>
                  {scheduledDays.length === 7 && ' (Every day)'}
                </>
              )}
              {frequency === 'weekly' && scheduledDays.length === 0 && (
                <span className="text-red-600 font-semibold">⚠️ Please select at least one day</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}