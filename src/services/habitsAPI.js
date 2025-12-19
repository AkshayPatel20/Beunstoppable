/*
  API layer for habits using Firestore.
  All functions use async/await and return plain objects or throw errors.
*/
import { firestore } from './firebase'
import { collection, addDoc, doc, getDocs, updateDoc, deleteDoc, query, where,setDoc, getDoc } from 'firebase/firestore'
import { subDays } from 'date-fns'


const habitsCol = collection(firestore, 'habit_tracker_habits')

export async function updateHabit(habitId, patch){
  const d = doc(firestore, 'habit_tracker_habits', habitId)
  await updateDoc(d, patch)
}

export async function deleteHabit(habitId){
  await deleteDoc(doc(firestore, 'habit_tracker_habits', habitId))
}

export async function getUserHabits(userId){
  const q = query(habitsCol, where('userId', '==', userId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function toggleTodayCompletion(habit){
  const docRef = doc(firestore, 'habit_tracker_habits', habit.id)
  const todayISO = new Date().toISOString().slice(0,10)
  const last = habit.lastCompletedDate ? habit.lastCompletedDate.slice(0,10) : null
  let newStreak = habit.streakCount || 0
  if(last === todayISO){
    newStreak = 0
    await updateDoc(docRef, { lastCompletedDate: null, streakCount: 0 })
    return { ...habit, lastCompletedDate: null, streakCount: 0 }
  }
  const yesterdayISO = subDays(new Date(),1).toISOString().slice(0,10)
  if(last === yesterdayISO){
    newStreak = (habit.streakCount || 0) + 1
  } else {
    newStreak = 1
  }
  await updateDoc(docRef, { lastCompletedDate: new Date().toISOString(), streakCount: newStreak })
  return { ...habit, lastCompletedDate: new Date().toISOString(), streakCount: newStreak }
}

export async function createHabit(habit) {
  const ref = await addDoc(habitsCol, {
    ...habit,
    streakCount: 0,
    lastCompletedDate: null,
    createdAt: new Date().toISOString(),
    // NEW: Scheduling fields
    frequency: habit.frequency || 'daily', // 'daily', 'weekly', 'custom'
    scheduledDays: habit.scheduledDays || [0, 1, 2, 3, 4, 5, 6], // All days by default
    customDates: habit.customDates || [], // For custom scheduling
    allowSkip: habit.allowSkip || false, // Allow skipping without breaking streak
    skippedDates: [] // Track skipped dates
  });
  return { id: ref.id, ...habit };
}

export async function skipHabitToday(habitId, habit) {
  const docRef = doc(firestore, 'habit_tracker_habits', habitId);
  const todayStr = new Date().toISOString().slice(0, 10);
  
  // Add today to skipped dates array
  const skippedDates = [...(habit.skippedDates || []), todayStr];
  
  await updateDoc(docRef, { skippedDates });
  
  return { ...habit, skippedDates };
}

export async function unskipHabitToday(habitId, habit) {
  const docRef = doc(firestore, 'habit_tracker_habits', habitId);
  const todayStr = new Date().toISOString().slice(0, 10);
  
  // Remove today from skipped dates
  const skippedDates = (habit.skippedDates || []).filter(date => date !== todayStr);
  
  await updateDoc(docRef, { skippedDates });
  
  return { ...habit, skippedDates };
}

export async function saveNotificationSettings(userId, settings) {
  const docRef = doc(firestore, 'user_notification_settings', userId);
  
  const dataToSave = {
    userId: userId,
    enabled: settings.enabled || false,
    dailyReminder: settings.dailyReminder || false,
    reminderTime: settings.reminderTime || '09:00',
    beforeBedReminder: settings.beforeBedReminder || false,
    beforeBedTime: settings.beforeBedTime || '21:00',
    motivationalMessages: settings.motivationalMessages || false,
    streakAlerts: settings.streakAlerts || false,
    habitSpecificReminders: settings.habitSpecificReminders || {},
    updatedAt: new Date().toISOString(),
    createdAt: settings.createdAt || new Date().toISOString()
  };
  
  console.log('💾 Saving to Firestore:', dataToSave);
  
  await setDoc(docRef, dataToSave);
  
  return dataToSave;
}

export async function getNotificationSettings(userId) {
  const docRef = doc(firestore, 'user_notification_settings', userId);
  const docSnap = await getDoc(docRef);
  
  console.log('📥 Fetching from Firestore for userId:', userId);
  console.log('Document exists:', docSnap.exists());
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log('📄 Document data:', data);
    
    // Verify userId matches
    if (data.userId !== userId) {
      console.error('⚠️ UserId mismatch!');
      return getDefaultSettings(userId);
    }
    
    return data;
  }
  
  console.log('📄 No document found, returning defaults');
  return getDefaultSettings(userId);
}

function getDefaultSettings(userId) {
  return {
    userId: userId,
    enabled: false,
    dailyReminder: true,
    reminderTime: '09:00',
    beforeBedReminder: true,
    beforeBedTime: '21:00',
    motivationalMessages: true,
    streakAlerts: true,
    habitSpecificReminders: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}