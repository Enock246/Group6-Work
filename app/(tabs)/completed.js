import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useTasks } from '../../contexts/TaskContext';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import TaskList from '../../components/TaskList';

export default function CompletedScreen() {
  const { colors } = useTheme();
  const { tasks, clearCompletedTasks } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');

  const completedTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && task.completed;
  });

  const handleClearCompleted = () => {
    if (completedTasks.length === 0) return;
    
    Alert.alert(
      'Clear Completed Tasks',
      `Are you sure you want to delete all ${completedTasks.length} completed tasks? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: clearCompletedTasks 
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Completed Tasks" 
        showClearButton={completedTasks.length > 0}
        onClearPress={handleClearCompleted}
      />
      
      <View style={styles.content}>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search completed tasks..."
        />
        
        <TaskList tasks={completedTasks} />
      </View>
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