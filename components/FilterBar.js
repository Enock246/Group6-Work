import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';

export default function FilterBar({ selectedCategory, onCategoryChange }) {
  const { colors } = useTheme();
  const { categories } = useTasks();

  const allCategories = ['all', ...categories];

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {allCategories.map((category) => {
          const isSelected = selectedCategory === category;
          const displayName = category === 'all' ? 'All' : category;
          
          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                {
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                }
              ]}
              onPress={() => onCategoryChange(category)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: isSelected ? 'white' : colors.text }
                ]}
              >
                {displayName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
});