/*
  API layer for habits using Firestore.
  All functions use async/await and return plain objects or throw errors.
*/
import { firestore } from './firebase'
import { collection, addDoc, doc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
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
  const skippedDates = [...(habit.skippedDates || []), todayStr];
  
  await updateDoc(docRef, { skippedDates });
  return { ...habit, skippedDates };
}