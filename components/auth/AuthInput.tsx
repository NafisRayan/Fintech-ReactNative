import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface AuthInputProps extends TextInputProps {
  label: string;
  rightIcon?: React.ReactNode;
  error?: string;
}

export function AuthInput({ label, rightIcon, error, ...props }: AuthInputProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={[
        styles.inputContainer,
        { 
          backgroundColor: colors.surface,
          borderColor: error ? colors.error : colors.border
        }
      ]}>
        <TextInput
          style={[
            styles.input,
            { color: colors.text }
          ]}
          placeholderTextColor={colors.textMuted}
          {...props}
        />
        {rightIcon && (
          <View style={styles.rightIcon}>
            {rightIcon}
          </View>
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  rightIcon: {
    marginLeft: 12,
  },
  error: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});