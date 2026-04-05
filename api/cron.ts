import * as admin from 'firebase-admin';

// Initialize Firebase Admin (safe to do it globally for serverless cold starts)
if (!admin.apps.length) {
  try {
    const serviceAccountJsonStr = process.env.FIREBASE_ADMIN_CREDENTIALS;
    if (serviceAccountJsonStr) {
      const serviceAccount = JSON.parse(serviceAccountJsonStr);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin initialized successfully");
    } else {
      console.error("FIREBASE_ADMIN_CREDENTIALS is missing");
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin", error);
  }
}

export default async function handler(req: any, res: any) {
  try {
    const db = admin.firestore();
    const messaging = admin.messaging();

    // Determine current hour in HH:00 format
    // Notice: Due to serverless typically running in UTC, you might want to adapt 
    // timezone logic later. For this MVP, we use the server's time or user's naive string.
    const now = new Date();
    // Using a naive assumption that users are in similar UTC offsets to server, 
    // or you can configure Vercel TZ env variable: TZ="America/Costa_Rica"
    const currentHourMin = `${now.getHours().toString().padStart(2, '0')}:00`; 

    const usersSnapshot = await db.collection('users').get();
    
    let sentCount = 0;

    for (const doc of usersSnapshot.docs) {
      const data = doc.data();
      if (data.fcmToken && data.reminders && Array.isArray(data.reminders)) {
        if (data.reminders.includes(currentHourMin)) {
          try {
            await messaging.send({
              token: data.fcmToken,
              notification: {
                title: '¡Hora de Hidratarte! 💧',
                body: 'Tu cuerpo necesita agua para mantener su vitalidad. ¡Toma un vaso ahora!',
              }
            });
            sentCount++;
          } catch (e) {
            console.error(`Failed to send FCM to ${doc.id}:`, e);
          }
        }
      }
    }

    res.status(200).json({ success: true, sent: sentCount, timeMatched: currentHourMin });
  } catch (error) {
    console.error("Cron Error", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
