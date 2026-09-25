import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
} from 'react-native';
import { THEME } from '../../constants';

interface FormLabelProps {
  children: React.ReactNode;
  style?: TextStyle;
}

/** Small uppercase label shown above a form field. */
export const FormLabel: React.FC<FormLabelProps> = ({ children, style }) => (
  <Text style={[styles.label, style]}>{children}</Text>
);

/** Themed text input used across all forms. */
export const FormInput: React.FC<TextInputProps> = ({ style, ...props }) => (
  <TextInput
    placeholderTextColor={THEME.colors.textMuted}
    {...props}
    style={[styles.input, style]}
  />
);

interface ErrorBannerProps {
  message?: string | null;
}

/** Red validation message; renders nothing when there's no message. */
export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message }) =>
  message ? <Text style={styles.errorBanner}>{message}</Text> : null;

const styles = StyleSheet.create({
  label: {
    ...THEME.typography.captionBold,
    color: THEME.colors.textSecondary,
    marginBottom: 6,
    marginTop: THEME.spacing.sm,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm + 2,
    fontSize: 15,
    color: THEME.colors.textPrimary,
  },
  errorBanner: {
    backgroundColor: THEME.colors.dangerLight,
    color: THEME.colors.danger,
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: THEME.spacing.md,
    fontSize: 13,
    fontWeight: '500',
  },
});
