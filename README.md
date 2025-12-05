# HabitFlow — Daily Habit Tracker (Vite + React + Tailwind)

## Quick start

1. Install dependencies
   ```bash
   npm install
   ```
2. Create a Firebase project and enable Google Auth + Firestore.
3. Replace the Firebase config in `src/services/firebase.js`.
4. Run the dev server
   ```bash
   npm run dev
   ```

## Features implemented
- Google Sign-In (Firebase v9 modular)
- Firestore data model (users + habits)
- Dashboard with habit cards, streaks, toggle for today's completion
- Habit Add modal
- Streak logic in `services/habitsAPI.js`
- Modern design system using Tailwind + framer-motion + lucide-react

## Notes
- This is a starter production-ready scaffold. You should replace Firebase config and add better error handling & pagination for many habits.
