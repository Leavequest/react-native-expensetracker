import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { THEME } from '../../constants';
import { Icon, IconName } from './Icon';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  subtitle?: string;
}

/** Centered placeholder shown when a list has nothing to display. */
export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle }) => (
  <View style={styles.container}>
    <View style={styles.iconCircle}>
      <Icon name={icon} size={32} color={THEME.colors.primary} />
    </View>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: THEME.spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
  },
  title: {
    ...THEME.typography.titleSmall,
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
    textAlign: 'center',
  },
});
