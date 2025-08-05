// services/notificationService.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Register for push notifications and get Expo token
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Permission denied for push notifications.");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
  } else {
    alert("Push notifications require a physical device.");
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#00adf5",
    });
  }

  return token;
}

// Schedule notification 15 minutes before the todo time
export const scheduleReminderBeforeTodo = async (selectedDate: string, time: string, title: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const todoDate = new Date(selectedDate);
  todoDate.setHours(hours, minutes, 0, 0);

  const reminderTime = new Date(todoDate.getTime() - 15 * 60 * 1000);

  if (reminderTime > new Date()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Reminder",
        body: `"${title}" is starting in 15 minutes.`,
      },
      trigger: reminderTime,
    });
  }
};

// Schedule notification at the exact task time
export const scheduleExactTimeNotification = async (selectedDate: string, time: string, title: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const taskTime = new Date(selectedDate);
  taskTime.setHours(hours, minutes, 0, 0);

  if (taskTime > new Date()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🚀 Time for your task",
        body: `Start: "${title}"`,
      },
      trigger: taskTime,
    });
  }
};

// Schedule daily morning summary (e.g., 8 AM)
export const scheduleMorningSummary = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🌞 Morning Tasks",
      body: "You have tasks scheduled today. Check your todo list!",
    },
    trigger: {
      hour: 8,
      minute: 0,
      repeats: true,
    },
  });
};

// Schedule daily end-of-day reminder (e.g., 9 PM)
export const scheduleEndOfDayReminder = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🌙 Wrap up!",
      body: "You may have pending tasks. Don't forget to complete them!",
    },
    trigger: {
      hour: 21,
      minute: 0,
      repeats: true,
    },
  });
};
