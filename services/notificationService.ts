// // services/notificationService.ts
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import { Platform } from "react-native";

// // Register for push notifications and get Expo token
// export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
//   let token;
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     if (finalStatus !== "granted") {
//       alert("Permission denied for push notifications.");
//       return;
//     }

//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log("Expo Push Token:", token);
//   } else {
//     alert("Push notifications require a physical device.");
//   }

//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.HIGH,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#00adf5",
//     });
//   }

//   return token;
// }

// // Schedule notification 15 minutes before the todo time
// export const scheduleReminderBeforeTodo = async (selectedDate: string, time: string, title: string) => {
//   const [hours, minutes] = time.split(":").map(Number);
//   const todoDate = new Date(selectedDate);
//   todoDate.setHours(hours, minutes, 0, 0);

//   const reminderTime = new Date(todoDate.getTime() - 15 * 60 * 1000);

//   if (reminderTime > new Date()) {
//     const notificationId= await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "⏰ Reminder", 
//         body: `"${title}" is starting in 15 minutes.`,
//       },
//       trigger: reminderTime,
//     }); 
//     return notificationId;
//   }
// };

// // Schedule notification at the exact task time
// export const scheduleExactTimeNotification = async (selectedDate: string, time: string, title: string) => {
//   const [hours, minutes] = time.split(":").map(Number);
//   const taskTime = new Date(selectedDate);
//   taskTime.setHours(hours, minutes, 0, 0);

//   if (taskTime > new Date()) {
//     const notificationId = await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "🚀 Time for your task",
//         body: `Start: "${title}"`,
//       },
//       trigger: taskTime,
//     });
//     return notificationId;
//   }
// };

// // Schedule daily morning summary (e.g., 8 AM)
// export const scheduleMorningSummary = async () => {
//   const notificationId = await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "🌞 Morning Tasks",
//       body: "You have tasks scheduled today. Check your todo list!",
//     },
//     trigger: {
//       hour: 8,
//       minute: 0,
//       repeats: true,
//     },
    
//   });
// };

// // Schedule daily end-of-day reminder (e.g., 9 PM)
// export const scheduleEndOfDayReminder = async () => {
//   return notificationId= await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "🌙 Wrap up!",
//       body: "You may have pending tasks. Don't forget to complete them!",
//     },
//     trigger: {
//       hour: 21,
//       minute: 0,
//       repeats: true,
//     },
//   });

// };



// export async function sendWarningNotification(overdueCount: number) {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "⚠️ Overdue Task Reminder",
//       body: `You have ${overdueCount} tasks that are overdue. Please review them.`,
//       sound: 'default', // play notification sound
//       priority: Notifications.AndroidNotificationPriority.HIGH,
//     },
//     trigger: null, // send immediately
//   });
// }




// // const getTodoDateTime = (dateStr: string, timeStr: string): Date => {
// //   const [year, month, day] = dateStr.split("-").map(Number);
// //   const [hour, minute] = timeStr.split(":").map(Number);
// //   return new Date(year, month - 1, day, hour, minute);
// // };



// const getTodoDateTime = (dateStr: string, timeStr: string): Date => {
//   if (!dateStr || !timeStr) return new Date(NaN); 
//   const [year, month, day] = dateStr.split("-").map(Number);
//   const [hour, minute] = timeStr.split(":").map(Number);

//   const result = new Date(year, month - 1, day, hour, minute);
//   return isNaN(result.getTime()) ? new Date(NaN) : result;
// };

// // export async function scheduleOverdueReminders(todoId: string, title: string, date: string, time: string) {
// //   const todoDateTime = getTodoDateTime(date, time);
// //   const now = new Date();

// //   // If the time is already in the past, start 1 min from now
// //   const warningStartTime = new Date(todoDateTime.getTime() + 1 * 60 * 1000);
// //   const isOverdue = todoDateTime < now;
// //   const initialTrigger = isOverdue ? new Date(now.getTime() + 1 * 60 * 1000) : warningStartTime;

// //   // Schedule first warning
// //   await Notifications.scheduleNotificationAsync({
// //     content: {
// //       title: "⚠️ Overdue Task",
// //       body: `You missed: ${title}. Mark it as done!`,
// //       sound: true,
// //       data: { todoId },
// //     },
// //     trigger: initialTrigger,
// //   });

// //   // Schedule repeating reminder every 2 hours
// //   await Notifications.scheduleNotificationAsync({
// //     content: {
// //       title: "⏰ Reminder",
// //       body: `"${title}" is still pending. Don't forget to complete it.`,
// //       sound: true,
// //       data: { todoId },
// //     },
// //     trigger: {
// //       seconds: isOverdue
// //         ? 2 * 60 * 60 // repeat every 2 hours from now
// //         : (todoDateTime.getTime() - now.getTime()) / 1000 + 1 * 60 + 2 * 60 * 60,
// //       repeats: true,
// //     },
// //   });
// // }


// export async function scheduleOverdueReminders(
//   todoId: string,
//   title: string,
//   date: string,
//   time: string
// ) {
//   const todoDateTime = getTodoDateTime(date, time);
//   console.log("Todo DateTime:", todoDateTime);
//   console.log("Current DateTime:", new Date());
//   const now = new Date();
//   const isOverdue = todoDateTime < now;

//   // Schedule 1-time overdue notification (1 min after task time or now)
//   const firstTrigger = isOverdue
//     ? new Date(now.getTime() + 1 * 60 * 1000) // 1 min from now
//     : new Date(todoDateTime.getTime() + 1 * 60 * 1000); // 1 min after task time

//   try {
//     const firstId = await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "⚠️ Overdue Task",
//         body: `You missed: ${title}. Mark it as done!`,
//         sound: true,
//         android: {
//           channelId: "default",
//         },
//         data: { todoId },
//       },
//       trigger: firstTrigger,
//     });

//     console.log("Scheduled first overdue warning ID:", firstId);

//     // Now manually schedule a few reminders (e.g., 3 future reminders every 2 hours)
//     for (let i = 1; i <= 3; i++) {
//       const triggerTime = new Date(firstTrigger.getTime() + i * 2 * 60 * 60 * 1000); // every 2 hours
//       const id = await Notifications.scheduleNotificationAsync({
//         content: {
//           title: "⏰ Reminder",
//           body: `"${title}" is still pending. Don't forget to complete it.`,
//           sound: true,
//           android: {
//             channelId: "default",
//           },
//           data: { todoId },
//         },
//         trigger: triggerTime,
//       });
//       console.log(`Scheduled reminder ${i} ID:`, id);
//     }

//   } catch (err) {
//     console.error("Failed to schedule overdue reminders:", err);
//   }
// }


// export async function cancelScheduledNotifications(ids: string[]) {
//   for (const id of ids) {
//     try {
//       await Notifications.cancelScheduledNotificationAsync(id);
//     } catch (err) {
//       console.warn("Failed to cancel notification:", id, err);
//     }
//   }
// }



// services/notificationService.ts
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
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
export const scheduleReminderBeforeTodo = async (
  selectedDate: string,
  time: string,
  title: string
): Promise<string | undefined> => {
  const [hours, minutes] = time.split(":").map(Number);
  const todoDate = new Date(selectedDate);
  todoDate.setHours(hours, minutes, 0, 0);

  const reminderTime = new Date(todoDate.getTime() - 15 * 60 * 1000);

  if (reminderTime > new Date()) {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Reminder",
        body: `"${title}" is starting in 15 minutes.`,
        sound: true,
        android: { channelId: "default" },
      },
      trigger: reminderTime,
    });
    return notificationId;
  }
};

// Schedule notification at the exact task time
export const scheduleExactTimeNotification = async (
  selectedDate: string,
  time: string,
  title: string
): Promise<string | undefined> => {
  const [hours, minutes] = time.split(":").map(Number);
  const taskTime = new Date(selectedDate);
  taskTime.setHours(hours, minutes, 0, 0);

  if (taskTime > new Date()) {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "🚀 Time for your task",
        body: `Start: "${title}"`,
        sound: true,
        android: { channelId: "default" },
      },
      trigger: taskTime,
    });
    return notificationId;
  }
};

// Daily morning summary (8 AM)
export const scheduleMorningSummary = async (): Promise<string> => {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "🌞 Morning Tasks",
      body: "You have tasks scheduled today. Check your todo list!",
      sound: true,
      android: { channelId: "default" },
    },
    trigger: {
      hour: 8,
      minute: 0,
      repeats: true,
    },
  });
  return notificationId;
};

// Daily end-of-day reminder (9 PM)
export const scheduleEndOfDayReminder = async (): Promise<string> => {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "🌙 Wrap up!",
      body: "You may have pending tasks. Don't forget to complete them!",
      sound: true,
      android: { channelId: "default" },
    },
    trigger: {
      hour: 21,
      minute: 0,
      repeats: true,
    },
  });
  return notificationId;
};

// Warning notification for overdue count
export async function sendWarningNotification(overdueCount: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⚠️ Overdue Task Reminder",
      body: `You have ${overdueCount} tasks that are overdue. Please review them.`,
      sound: 'default',
      android: { channelId: "default" },
    },
    trigger: null, // send immediately
  });
}

// Get a Date object from date and time strings
const getTodoDateTime = (dateStr: string, timeStr: string): Date => {
  if (!dateStr || !timeStr) return new Date(NaN);
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  const result = new Date(year, month - 1, day, hour, minute);
  return isNaN(result.getTime()) ? new Date(NaN) : result;
};

// Schedule multiple overdue reminders
export async function scheduleOverdueReminders(
  todoId: string,
  title: string,
  date: string,
  time: string
): Promise<string[]> {
  const todoDateTime = getTodoDateTime(date, time);
  const now = new Date();
  const isOverdue = todoDateTime < now;
  const firstTrigger = isOverdue
    ? new Date(now.getTime() + 1 * 60 * 1000)
    : new Date(todoDateTime.getTime() + 1 * 60 * 1000);

  const notificationIds: string[] = [];

  try {
    const firstId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ Overdue Task",
        body: `You missed: ${title}. Mark it as done!`,
        sound: true,
        android: { channelId: "default" },
        data: { todoId },
      },
      trigger: firstTrigger,
    });
    notificationIds.push(firstId);

    for (let i = 1; i <= 3; i++) {
      const triggerTime = new Date(firstTrigger.getTime() + i * 2 * 60 * 60 * 1000);
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "⏰ Reminder",
          body: `"${title}" is still pending. Don't forget to complete it.`,
          sound: true,
          android: { channelId: "default" },
          data: { todoId },
        },
        trigger: triggerTime,
      });
      notificationIds.push(id);
    }

  } catch (err) {
    console.error("Failed to schedule overdue reminders:", err);
  }

  return notificationIds;
}

// Cancel a list of notifications
export async function cancelScheduledNotifications(ids: string[]) {
  for (const id of ids) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch (err) {
      console.warn("Failed to cancel notification:", id, err);
    }
  }
}
