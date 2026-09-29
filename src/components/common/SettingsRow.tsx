import React, { ReactNode } from 'react';
import {
  AccessibilityRole,
  AccessibilityState,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { THEME } from '../../constants';
import { Icon } from './Icon';
import { makeStyles, useTheme } from '../../context';

interface SettingsRowProps {
  label: string;
  /** Avatar or icon shown before the label */
  left?: ReactNode;
  /** Current value shown on the right, e.g. "€ EUR" */
  value?: string;
  /** Custom control shown on the right, e.g. a Switch or a check mark */
  right?: ReactNode;
  /** Tags shown after the label, e.g. member tags or a "Soon" badge */
  tags?: ReactNode;
  /** Defaults to a chevron when the row is pressable */
  accessory?: 'chevron' | 'menu' | 'none';
  destructive?: boolean;
  disabled?: boolean;
  /** Shown under the label while disabled, explaining why */
  disabledCaption?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
}

/** One row of a grouped settings list. */
export const SettingsRow: React.FC<SettingsRowProps> = ({
  label,
  left,
  value,
  right,
  tags,
  accessory,
  destructive = false,
  disabled = false,
  disabledCaption,
  onPress,
  accessibilityLabel = label,
  accessibilityRole = 'button',
  accessibilityState,
}) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const shownAccessory = accessory ?? (onPress ? 'chevron' : 'none');
  const labelColor = disabled
    ? colors.textMuted
    : destructive
      ? colors.danger
      : colors.textPrimary;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || !onPress}
      style={styles.row}
      accessibilityRole={onPress ? accessibilityRole : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={disabled ? disabledCaption : undefined}
      accessibilityState={{ ...accessibilityState, disabled }}
    >
      {left ? <View style={[styles.left, disabled && styles.dimmed]}>{left}</View> : null}

      <View style={styles.body}>
        <View style={styles.labelLine}>
          <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
            {label}
          </Text>
          {tags}
        </View>
        {disabled && disabledCaption ? (
          <Text style={styles.caption}>{disabledCaption}</Text>
        ) : null}
      </View>

      {value ? <Text style={styles.value}>{value}</Text> : null}
      {right}
      {shownAccessory === 'chevron' ? (
        <Icon name="chevron-right" size={16} color={colors.textMuted} />
      ) : null}
      {shownAccessory === 'menu' ? (
        <Icon name="chevron-down" size={16} color={colors.textMuted} />
      ) : null}
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(colors => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    gap: THEME.spacing.md,
  },
  left: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimmed: {
    opacity: 0.5,
  },
  body: {
    flex: 1,
  },
  labelLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    ...THEME.typography.body,
    flexShrink: 1,
  },
  caption: {
    ...THEME.typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  value: {
    ...THEME.typography.body,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
}));
