import React, { ReactNode } from 'react';
import { Text } from 'react-native';
import { Card } from '../../components/common';
import { THEME } from '../../constants';
import { makeStyles } from '../../context';

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
}) => {
  const styles = useStyles();

  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <Card style={styles.card}>
        {description ? <Text style={styles.description}>{description}</Text> : null}
        {children}
      </Card>
    </>
  );
};

const useStyles = makeStyles(colors => ({
  title: {
    ...THEME.typography.titleSmall,
    color: colors.textPrimary,
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.xs,
  },
  card: {
    marginHorizontal: THEME.spacing.lg,
    backgroundColor: colors.surface,
  },
  description: {
    ...THEME.typography.caption,
    color: colors.textSecondary,
    marginBottom: THEME.spacing.md,
    lineHeight: 18,
  },
}));
