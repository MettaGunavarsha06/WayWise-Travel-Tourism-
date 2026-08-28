import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  keyboardType = 'default',
  error,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.cardSecondary,
            borderColor: error ? theme.error : theme.border,
          },
          multiline && { height: numberOfLines * 24 + 20, alignItems: 'flex-start' },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={theme.textMuted}
            style={[styles.leftIcon, multiline && { marginTop: 10 }]}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={[
            styles.input,
            {
              color: theme.text,
            },
            inputStyle,
          ]}
        />
        {rightIcon && (
          <Ionicons
            name={rightIcon}
            size={20}
            color={theme.textMuted}
            onPress={onRightIconPress}
            style={styles.rightIcon}
          />
        )}
      </View>
      {error ? <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 50,
  },
  leftIcon: {
    marginRight: 10,
  },
  rightIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
