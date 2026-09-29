import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../../constants';
import { useUser, makeStyles, useTheme } from '../../context';
import { useAccountSheet } from '../account/accountSheetContext';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, rightAction }) => {
  const styles = useStyles();
  const { colors, isDark, toggleTheme } = useTheme();
  const { activeUser } = useUser();
  const { openAccountSheet } = useAccountSheet();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + THEME.spacing.md }]}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={toggleTheme}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          testID="theme-toggle"
        >
          <View style={styles.themeCircle}>
            <Icon name={isDark ? 'sun' : 'moon'} size={18} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openAccountSheet}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel={`Account, ${activeUser.name}`}
        >
          <Avatar user={activeUser} size={32} />
        </TouchableOpacity>

        {rightAction ? <View style={styles.actionWrapper}>{rightAction}</View> : null}
      </View>
    </View>
  );
};

const useStyles = makeStyles(colors => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    ...THEME.typography.titleMedium,
    color: colors.textPrimary,
  },
  subtitle: {
    ...THEME.typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // 44pt touch target around the 32pt avatar / theme toggle
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSubtle,
  },
  actionWrapper: {
    marginLeft: 4,
  },
}));
