import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Display notifications when the app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Configure notification permissions
export async function configureNotifications() {
  if (Platform.OS === 'web') {
    return {
      granted: false,
      message: 'Notifications require a mobile device.',
    };
  }

  try {
    // Create Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(
        'foodie-notifications',
        {
          name: 'Foodie Notifications',
          description: 'Cooking reminders and recipe updates',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#E47743',
        }
      );
    }

    // Check notification permissions
    const existing =
      await Notifications.getPermissionsAsync();

    let granted = existing.granted;

    // Request permission if not already granted
    if (!granted) {
      const requested =
        await Notifications.requestPermissionsAsync();

      granted = requested.granted;
    }

    return {
      granted,
      message: granted
        ? 'Notification permission granted!'
        : 'Notification permission denied.',
    };

  } catch (error) {
    console.error('Notification setup error:', error);

    return {
      granted: false,
      message: error.message,
    };
  }
}

// Send an immediate test notification
export async function sendTestNotification() {
  const permission = await configureNotifications();

  if (!permission.granted) {
    throw new Error(permission.message);
  }

  const notificationId =
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Welcome to Foodie! 🍽️',
        body: 'Your kitchen is ready! Discover a delicious new recipe today.',
        sound: 'default',
        data: {
          screen: 'Home',
          type: 'test',
        },
      },
      trigger: null,
    });

  return notificationId;
}

// Schedule a cooking reminder
export async function scheduleCookingReminder(seconds = 60) {
  const permission = await configureNotifications();

  if (!permission.granted) {
    throw new Error(permission.message);
  }

  const notificationId =
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time to Cook! 👨‍🍳',
        body: 'Open Foodie and try something delicious today!',
        sound: 'default',
        data: {
          screen: 'Home',
          type: 'cooking-reminder',
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(1, Math.floor(seconds)),
        repeats: false,
      },
    });

  return notificationId;
}

// Get scheduled notifications
export async function getScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}

// Cancel one notification
export async function cancelNotification(id) {
  if (!id) return;

  await Notifications.cancelScheduledNotificationAsync(id);
}

// Cancel all notifications
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Listen for notifications
export function addNotificationListeners(onReceived, onResponse) {
  const receivedSubscription =
    Notifications.addNotificationReceivedListener(notification => {
      onReceived?.(notification);
    });

  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener(response => {
      onResponse?.(response);
    });

  // Remove listeners when no longer needed
  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}
