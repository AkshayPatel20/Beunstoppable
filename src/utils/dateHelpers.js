import { format, parseISO, isToday } from 'date-fns'

export const formatDate = (iso) => {
  if(!iso) return '-'
  try{ return format(parseISO(iso), 'MMM d, yyyy') } catch(e){ return iso }
}

export const isCompletedToday = (iso) => {
  if(!iso) return false
  return isToday(parseISO(iso))
}

export const isScheduledToday = (habit) => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  const todayStr = today.toISOString().slice(0, 10);
  
  if (habit.frequency === 'daily') {
    return true;
  }
  
  if (habit.frequency === 'weekly') {
    return habit.scheduledDays?.includes(dayOfWeek) || false;
  }
  
  if (habit.frequency === 'custom') {
    return habit.customDates?.includes(todayStr) || false;
  }
  
  return true;
};

export const isSkippedToday = (habit) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  return habit.skippedDates?.includes(todayStr) || false;
};

export const getNextScheduledDate = (habit) => {
  const today = new Date();
  
  if (habit.frequency === 'daily') {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  }
  
  if (habit.frequency === 'weekly') {
    const currentDay = today.getDay();
    const scheduledDays = habit.scheduledDays || [];
    
    // Find next scheduled day
    for (let i = 1; i <= 7; i++) {
      const nextDay = (currentDay + i) % 7;
      if (scheduledDays.includes(nextDay)) {
        const nextDate = new Date(today);
        nextDate.setDate(nextDate.getDate() + i);
        return nextDate.toISOString().slice(0, 10);
      }
    }
  }
  
  return 'Not scheduled';
};

export const formatFrequency = (habit) => {
  if (habit.frequency === 'daily') return 'Every day';
  
  if (habit.frequency === 'weekly') {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const scheduledDays = (habit.scheduledDays || []).map(d => days[d]);
    return scheduledDays.join(', ');
  }
  
  if (habit.frequency === 'custom') {
    return 'Custom schedule';
  }
  
  return 'Daily';
};