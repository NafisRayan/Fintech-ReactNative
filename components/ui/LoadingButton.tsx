import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface LoadingButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function LoadingButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle
}: LoadingButtonProps) {
  const { colors } = useTheme();
  
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        isDisabled && { opacity: 0.6 }
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={[styles.text, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});