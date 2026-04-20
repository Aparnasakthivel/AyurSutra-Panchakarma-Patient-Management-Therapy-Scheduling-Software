// Browser Notification Service
export function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return Promise.resolve(false);
  }

  if (Notification.permission === 'granted') {
    return Promise.resolve(true);
  }

  if (Notification.permission !== 'denied') {
    return Notification.requestPermission().then(permission => {
      return permission === 'granted';
    });
  }

  return Promise.resolve(false);
}

export function sendBrowserNotification(title, options = {}) {
  if (!('Notification' in window)) return null;

  if (Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/logo.png',
      badge: '/logo.png',
      ...options
    });
  }

  return null;
}

export function showNotificationAlert(message, type = 'info') {
  const title = {
    success: '✅ Success',
    error: '❌ Error',
    warning: '⚠️ Warning',
    info: 'ℹ️ Information'
  }[type] || 'Notification';

  sendBrowserNotification(title, {
    body: message,
    tag: type,
    requireInteraction: type === 'error' || type === 'warning'
  });
}
