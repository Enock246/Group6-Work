import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useTasks } from '../../contexts/TaskContext';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import FilterBar from '../../components/FilterBar';
import TaskList from '../../components/TaskList';
import AddTaskModal from '../../components/AddTaskModal';

export default function AllTasksScreen() {
  const { colors } = useTheme();
  const { tasks } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="All Tasks" 
        onAddPress={() => setShowAddModal(true)}
      />
      
      <View style={styles.content}>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search tasks..."
        />
        
        <FilterBar 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <TaskList tasks={filteredTasks} />
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