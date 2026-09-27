import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../../constants';
import { useUser } from '../../context';
import { useAccountSheet } from '../account/accountSheetContext';
import { Avatar } from './Avatar';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, rightAction }) => {
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
          onPress={openAccountSheet}
          style={styles.avatarButton}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceBorder,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    ...THEME.typography.titleMedium,
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // 44pt touch target around the 32pt avatar
  avatarButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionWrapper: {
    marginLeft: 4,
  },
});
