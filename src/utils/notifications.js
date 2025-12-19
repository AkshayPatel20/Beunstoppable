class NotificationService {
  constructor() {
    this.permission = Notification.permission;
  }

  /**
   * Request notification permission from user
   */
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    }

    return false;
  }

  /**
   * Show browser notification
   */
  show(title, options = {}) {
    if (this.permission !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    const defaultOptions = {
      icon: '/logo.png', // Your app logo
      badge: '/badge.png',
      vibrate: [200, 100, 200],
      requireInteraction: false,
      ...options
    };

    return new Notification(title, defaultOptions);
  }

  /**
   * Schedule notification for specific time
   */
  scheduleNotification(habit, time) {
    const now = new Date();
    const [hours, minutes] = time.split(':');
    const scheduledTime = new Date(now);
    scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime - now;

    return setTimeout(() => {
      this.show(`⏰ Time for: ${habit.name}`, {
        body: habit.description,
        tag: `habit-${habit.id}`,
        data: { habitId: habit.id }
      });
    }, delay);
  }

  /**
   * Check if it's time to send daily reminder
   */
  checkDailyReminders(habits, notificationSettings) {
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    habits.forEach(habit => {
      if (habit.reminderTime === currentTime && notificationSettings.enabled) {
        this.show(`⏰ Time for: ${habit.name}`, {
          body: habit.description,
          tag: `habit-${habit.id}`
        });
      }
    });
  }
}

export const notificationService = new NotificationService();
