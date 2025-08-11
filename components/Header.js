import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export default function Header({ title, onAddPress, showClearButton, onClearPress }) {
  const { colors, toggleTheme, themeMode } = useTheme();

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light': return 'sunny';
      case 'dark': return 'moon';
      case 'system': return 'phone-portrait';
      default: return 'sunny';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.leftSection}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
      
      <View style={styles.rightSection}>
        {showClearButton && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.error }]}
            onPress={onClearPress}
          >
            <Ionicons name="trash" size={20} color="white" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.surfaceSecondary }]}
          onPress={toggleTheme}
        >
          <Ionicons name={getThemeIcon()} size={20} color={colors.text} />
        </TouchableOpacity>
        
        {onAddPress && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={onAddPress}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});