import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';

export default function EditTaskModal({ visible, task, onClose }) {
  const { colors } = useTheme();
  const { updateTask, categories, addCategory } = useTasks();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setCategory(task.category || '');
      setDueDate(task.dueDate || '');
      setReminderEnabled(task.reminderEnabled !== false);
    }
  }, [task]);

  const resetForm = () => {
    setShowNewCategory(false);
    setNewCategoryName('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      await addCategory(newCategoryName.trim());
      setCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowNewCategory(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    try {
      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        dueDate: dueDate || null,
        reminderEnabled,
      });
      handleClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const handleDateChange = (text) => {
    setDueDate(text ? new Date(text).toISOString() : '');
  };

  if (!task) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={[styles.cancelButton, { color: colors.textSecondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Edit Task</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.saveButton, { color: colors.primary }]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description"
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: category === cat ? colors.primary : colors.surface,
                      borderColor: category === cat ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    { color: category === cat ? 'white' : colors.text }
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.categoryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => setShowNewCategory(true)}
              >
                <Ionicons name="add" size={16} color={colors.text} />
                <Text style={[styles.categoryButtonText, { color: colors.text }]}>New</Text>
              </TouchableOpacity>
            </ScrollView>

            {showNewCategory && (
              <View style={styles.newCategoryContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                  placeholder="Category name"
                  placeholderTextColor={colors.textTertiary}
                />
                <View style={styles.newCategoryActions}>
                  <TouchableOpacity onPress={() => setShowNewCategory(false)}>
                    <Text style={[styles.cancelButton, { color: colors.textSecondary }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleAddCategory}>
                    <Text style={[styles.saveButton, { color: colors.primary }]}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Due Date</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              value={formatDateForInput(dueDate)}
              onChangeText={handleDateChange}
              placeholder="YYYY-MM-DDTHH:MM"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.reminderToggle}
              onPress={() => setReminderEnabled(!reminderEnabled)}
            >
              <View style={styles.reminderInfo}>
                <Text style={[styles.label, { color: colors.text }]}>Reminder</Text>
                <Text style={[styles.reminderDescription, { color: colors.textSecondary }]}>
                  Get notified 1 hour before due time
                </Text>
              </View>
              <View style={[
                styles.toggle,
                { backgroundColor: reminderEnabled ? colors.primary : colors.border }
              ]}>
                <View style={[
                  styles.toggleThumb,
                  {
                    backgroundColor: 'white',
                    transform: [{ translateX: reminderEnabled ? 20 : 2 }],
                  }
                ]} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    fontSize: 16,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    marginVertical: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    gap: 4,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  newCategoryContainer: {
    marginTop: 12,
  },
  newCategoryActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 8,
  },
  reminderToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reminderInfo: {
    flex: 1,
  },
  reminderDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});