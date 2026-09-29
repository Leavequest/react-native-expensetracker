import React from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
} from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { THEME } from '../../constants';
import { useIsInsideSheet } from './sheetContext';
import { makeStyles, useTheme } from '../../context';

interface FormLabelProps {
  children: React.ReactNode;
  style?: TextStyle;
}

/** Small uppercase label shown above a form field. */
export const FormLabel: React.FC<FormLabelProps> = ({ children, style }) => {
  const styles = useStyles();

  return (
    <Text style={[styles.label, style]}>{children}</Text>
  );
};

/**
 * Themed text input used across all forms. Inside a bottom sheet it uses the
 * sheet-aware input so the sheet moves up with the keyboard.
 */
export const FormInput: React.FC<TextInputProps> = ({ style, ...props }) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const Input = useIsInsideSheet() ? BottomSheetTextInput : TextInput;
  return (
    <Input
      placeholderTextColor={colors.textMuted}
      {...props}
      style={[styles.input, style]}
    />
  );
};

interface ErrorBannerProps {
  message?: string | null;
}

/** Red validation message; renders nothing when there's no message. */
export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message }) => {
  const styles = useStyles();
  return message ? <Text style={styles.errorBanner}>{message}</Text> : null;
};

const useStyles = makeStyles(colors => ({
  label: {
    ...THEME.typography.captionBold,
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: THEME.spacing.sm,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm + 2,
    fontSize: 15,
    color: colors.textPrimary,
  },
  errorBanner: {
    backgroundColor: colors.dangerLight,
    color: colors.danger,
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: THEME.spacing.md,
    fontSize: 13,
    fontWeight: '500',
  },
}));
