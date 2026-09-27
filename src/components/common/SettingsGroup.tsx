import React, { ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { THEME } from '../../constants';

interface SettingsGroupProps {
  title?: string;
  /** Explanation shown under the group */
  caption?: string;
  style?: ViewStyle;
  children: ReactNode;
}

/** Titled card of settings rows with hairlines between them. */
export const SettingsGroup: React.FC<SettingsGroupProps> = ({ title, caption, style, children }) => {
  const rows = React.Children.toArray(children);

  return (
    <View style={[styles.group, style]}>
      {title ? (
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
      ) : null}
      <View style={styles.card}>
        {rows.map((row, index) => (
          <React.Fragment key={index}>
            {index > 0 ? <View style={styles.separator} /> : null}
            {row}
          </React.Fragment>
        ))}
      </View>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  group: {
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.lg,
  },
  title: {
    ...THEME.typography.captionBold,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.xs,
    marginLeft: THEME.spacing.xs,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: THEME.colors.surfaceBorder,
    marginLeft: THEME.spacing.lg,
  },
  caption: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.xs,
    marginHorizontal: THEME.spacing.xs,
    lineHeight: 18,
  },
});
