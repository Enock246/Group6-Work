import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';
import EditTaskModal from './EditTaskModal';

export default function TaskItem({ task }) {
  const { colors } = useTheme();
  const { toggleTaskCompletion, deleteTask } = useTasks();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleToggleComplete = () => {
    toggleTaskCompletion(task.id);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTask(task.id) },
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.surface,
        borderColor: colors.border,
        opacity: task.completed ? 0.7 : 1,
      }
    ]}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={handleToggleComplete}
      >
        <View style={[
          styles.checkbox,
          {
            backgroundColor: task.completed ? colors.success : 'transparent',
            borderColor: task.completed ? colors.success : colors.border,
          }
        ]}>
          {task.completed && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.content}
        onPress={() => setShowEditModal(true)}
      >
        <View style={styles.header}>
          <Text style={[
            styles.title,
            {
              color: colors.text,
              textDecorationLine: task.completed ? 'line-through' : 'none',
            }
          ]}>
            {task.title}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => setShowEditModal(true)}>
              <Ionicons name="create-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {task.description && (
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {task.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {task.category}
            </Text>
          </View>
          
          {task.dueDate && (
            <Text style={[
              styles.dueDate,
              {
                color: isOverdue ? colors.error : colors.textSecondary,
                fontWeight: isOverdue ? '600' : 'normal',
              }
            ]}>
              {formatDate(task.dueDate)}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <EditTaskModal
        visible={showEditModal}
        task={task}
        onClose={() => setShowEditModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dueDate: {
    fontSize: 12,
    fontWeight: '500',
  },
});