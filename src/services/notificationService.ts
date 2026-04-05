/// <reference types="vite/client" />
/**
 * Service to handle browser notifications for water reminders.
 */

import { messaging, db, auth } from '../firebase';
import { getToken } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';

class NotificationService {
  private timers: number[] = [];

  /**
   * Request permission to show notifications
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notification');
      return false;
    }

    if (Notification.permission === 'granted') {
      await this.saveToken();
      return true;
    }

    if (Notification.permission !== 'denied') {
      console.log('Requesting notification permission...');
      const permission = await Notification.requestPermission();
      console.log('Notification permission result:', permission);
      if (permission === 'granted') {
        await this.saveToken();
        return true;
      }
      return false;
    }

    return false;
  }

  async saveToken() {
    try {
      if (!auth.currentUser) return;
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        console.warn('Vapid Key missing, cannot register for Push');
        return;
      }

      const currentToken = await getToken(messaging, { vapidKey });
      if (currentToken) {
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          fcmToken: currentToken,
          lastTokenUpdate: new Date().toISOString()
        }, { merge: true });
        console.log('FCM Token Guardado!');
      }
    } catch (error) {
      console.error('Error obtaining/saving FCM token', error);
    }
  }

  /**
   * Show an immediate notification
   */
  async showNotification(title: string, body: string) {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      try {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          if (registration && registration.showNotification) {
            await registration.showNotification(title, {
              body,
              icon: '/pwa-192x192.png',
              badge: '/pwa-192x192.png',
              tag: 'water-reminder'
            });
            return;
          }
        }

        new Notification(title, {
          body,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: 'water-reminder'
        });
      } catch (e) {
        // Fallback for some mobile browsers that require service worker for notifications
        console.warn('Standard Notification failed, might need Service Worker:', e);
      }
    }
  }

  /**
   * Test the notification system
   */
  testNotification() {
    this.showNotification(
      '¡Prueba de Santuario! 💧',
      'Si ves esto, las notificaciones están configuradas correctamente.'
    );
  }

  /**
   * Schedule notifications based on a list of times (HH:mm)
   */
  scheduleReminders(times: string[]) {
    this.clearAllNotifications();

    if (Notification.permission !== 'granted') return;

    const now = new Date();

    times.forEach(timeStr => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      // If the time has already passed today, schedule for tomorrow
      if (scheduledTime.getTime() <= now.getTime()) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const delay = scheduledTime.getTime() - now.getTime();

      const timerId = window.setTimeout(() => {
        this.showNotification(
          '¡Hora de Hidratarte! 💧',
          'Tu cuerpo necesita agua para mantener su vitalidad. ¡Toma un vaso ahora!'
        );
        // Re-schedule for the next day
        this.scheduleReminders(times);
      }, delay);

      this.timers.push(timerId);
    });

    console.log(`Scheduled ${this.timers.length} water reminders.`);
  }

  /**
   * Clear all scheduled timers
   */
  clearAllNotifications() {
    this.timers.forEach(id => window.clearTimeout(id));
    this.timers = [];
  }
}

export const notificationService = new NotificationService();
