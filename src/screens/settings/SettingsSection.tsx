import React, { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from '../../components/common';
import { THEME } from '../../constants';

interface SettingsSectionProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}

/** Titled card used for each group of settings. */
export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  children,
}) => (
  <>
    <Text style={styles.title}>{title}</Text>
    <Card style={styles.card}>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {children}
    </Card>
  </>
);

const styles = StyleSheet.create({
  title: {
    ...THEME.typography.titleSmall,
    color: THEME.colors.textPrimary,
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.xs,
  },
  card: {
    marginHorizontal: THEME.spacing.lg,
    backgroundColor: THEME.colors.surface,
  },
  description: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
    lineHeight: 18,
  },
});
