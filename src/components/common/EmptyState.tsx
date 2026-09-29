import React from 'react';
import { Text, View } from 'react-native';
import { THEME } from '../../constants';
import { Icon, IconName } from './Icon';
import { makeStyles, useTheme } from '../../context';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  subtitle?: string;
}

/** Centered placeholder shown when a list has nothing to display. */
export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle }) => {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name={icon} size={32} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const useStyles = makeStyles(colors => ({
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
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
  },
  title: {
    ...THEME.typography.titleSmall,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    ...THEME.typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
}));
