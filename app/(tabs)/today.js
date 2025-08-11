import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useTasks } from '../../contexts/TaskContext';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import TaskList from '../../components/TaskList';
import AddTaskModal from '../../components/AddTaskModal';

export default function TodayScreen() {
  const { colors } = useTheme();
  const { tasks } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const today = new Date().toDateString();
  
  const todayTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const isToday = task.dueDate && new Date(task.dueDate).toDateString() === today;
    return matchesSearch && isToday && !task.completed;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Today's Tasks" 
        onAddPress={() => setShowAddModal(true)}
      />
      
      <View style={styles.content}>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search today's tasks..."
        />
        
        <TaskList tasks={todayTasks} />
      </View>

      <AddTaskModal 
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});