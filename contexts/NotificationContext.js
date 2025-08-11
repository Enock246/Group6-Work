import React, { createContext, useContext, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

const NotificationContext = createContext();

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function NotificationProvider({ children }) {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
  };

  const scheduleNotification = async (task) => {
    if (!task.dueDate) return;

    const dueDate = new Date(task.dueDate);
    const now = new Date();
    
    // Don't schedule notifications for past dates
    if (dueDate <= now) return;

    // Schedule notification 1 hour before due time
    const notificationTime = new Date(dueDate.getTime() - 60 * 60 * 1000);
    
    // Don't schedule if notification time is in the past
    if (notificationTime <= now) return;

    try {
      await Notifications.scheduleNotificationAsync({
        identifier: task.id,
        content: {
          title: 'Task Reminder',
          body: `"${task.title}" is due in 1 hour`,
          data: { taskId: task.id },
        },
        trigger: {
          date: notificationTime,
        },
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const cancelNotification = async (taskId) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(taskId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  };

  const value = {
    scheduleNotification,
    cancelNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}