import React from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  style?: StyleProp<ViewStyle>;
}

export default function ThemeToggle({ style }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Activar modo ${isDarkMode ? 'claro' : 'oscuro'}`}
      onPress={toggleTheme}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: isDarkMode ? '#a8d52a' : '#253c9b' },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={22} color={isDarkMode ? '#17210c' : '#ffffff'} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 4,
  },
  pressed: {
    opacity: 0.78,
  },
});