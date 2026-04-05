importScripts('https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD_3JH8OP7d1giB0ZFoC91VKnUAIdRmXxc",
  authDomain: "gen-lang-client-0572616702.firebaseapp.com",
  projectId: "gen-lang-client-0572616702",
  storageBucket: "gen-lang-client-0572616702.firebasestorage.app",
  messagingSenderId: "527993115738",
  appId: "1:527993115738:web:d87539fd4e06f20afeb463"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title || "Nuevo mensaje";
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pwa-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
