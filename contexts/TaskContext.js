import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotifications } from './NotificationContext';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState(['Personal', 'Work', 'Shopping', 'Health']);
  const [isLoading, setIsLoading] = useState(true);
  const { scheduleNotification, cancelNotification } = useNotifications();

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const savedCategories = await AsyncStorage.getItem('categories');
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const saveCategories = async (newCategories) => {
    try {
      await AsyncStorage.setItem('categories', JSON.stringify(newCategories));
      setCategories(newCategories);
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  const addTask = async (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || '',
      category: taskData.category,
      dueDate: taskData.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    const newTasks = [...tasks, newTask];
    await saveTasks(newTasks);

    // Schedule notification if due date is set
    if (taskData.dueDate && taskData.reminderEnabled) {
      await scheduleNotification(newTask);
    }

    return newTask;
  };

  const updateTask = async (taskId, updates) => {
    const newTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, ...updates };
        
        // Handle completion status change
        if (updates.hasOwnProperty('completed')) {
          updatedTask.completedAt = updates.completed ? new Date().toISOString() : null;
        }

        return updatedTask;
      }
      return task;
    });

    await saveTasks(newTasks);

    // Handle notification updates
    const updatedTask = newTasks.find(task => task.id === taskId);
    if (updatedTask) {
      await cancelNotification(taskId);
      if (updatedTask.dueDate && !updatedTask.completed && updates.reminderEnabled !== false) {
        await scheduleNotification(updatedTask);
      }
    }
  };

  const deleteTask = async (taskId) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    await saveTasks(newTasks);
    await cancelNotification(taskId);
  };

  const toggleTaskCompletion = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { completed: !task.completed });
    }
  };

  const clearCompletedTasks = async () => {
    const completedTaskIds = tasks.filter(task => task.completed).map(task => task.id);
    const newTasks = tasks.filter(task => !task.completed);
    await saveTasks(newTasks);

    // Cancel notifications for deleted tasks
    for (const taskId of completedTaskIds) {
      await cancelNotification(taskId);
    }
  };

  const addCategory = async (categoryName) => {
    if (!categories.includes(categoryName)) {
      const newCategories = [...categories, categoryName];
      await saveCategories(newCategories);
    }
  };

  const value = {
    tasks,
    categories,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    clearCompletedTasks,
    addCategory,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}