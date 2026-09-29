import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { getCategoryInfo, ThemeColors, THEME } from '../../constants';
import { makeStyles, useTheme, useUser } from '../../context';
import { TimelineEntry } from '../../utils';
import { CategoryIcon, deleteAccessibilityProps, IconName } from '../common';

interface RowDisplay {
  icon: IconName;
  color: string;
  title: string;
  subtitle: string;
}

function describeEntry(
  entry: TimelineEntry,
  walletName: (walletId: string) => string,
  colors: ThemeColors
): RowDisplay {
  switch (entry.kind) {
    case 'expense': {
      const info = getCategoryInfo(entry.item.category);
      return {
        icon: info.icon,
        color: info.color,
        title: entry.item.title,
        subtitle: `${entry.item.category} · ${walletName(entry.item.walletId)}`,
      };
    }
    case 'income':
      return {
        icon: 'income',
        color: colors.success,
        title: entry.item.title,
        subtitle: `Income · ${walletName(entry.item.walletId)}`,
      };
    case 'transfer':
      return {
        icon: 'transfer',
        color: colors.info,
        title: 'Transfer',
        subtitle: `${walletName(entry.item.fromWalletId)} → ${walletName(entry.item.toWalletId)}`,
      };
  }
}

interface TimelineRowProps {
  entry: TimelineEntry;
  /** Signed amount for the wallets being viewed; 0 means money only moved between them */
  amount: number;
  walletName: (walletId: string) => string;
  /** Exposed to screen readers as a "Delete" action (sighted users swipe) */
  onDelete?: () => void;
}

export const TimelineRow: React.FC<TimelineRowProps> = ({ entry, amount, walletName, onDelete }) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const { formatAmount } = useUser();
  const { icon, color, title, subtitle } = describeEntry(entry, walletName, colors);

  const amountText =
    amount === 0
      ? formatAmount(entry.item.amount)
      : amount > 0
        ? `+${formatAmount(amount)}`
        : formatAmount(amount);
  const amountColor =
    amount === 0 ? colors.textMuted : amount > 0 ? colors.success : colors.textPrimary;

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      accessibilityLabel={`${title}, ${amountText}, ${subtitle}`}
      {...(onDelete ? deleteAccessibilityProps(onDelete) : {})}
    >
      <CategoryIcon name={icon} color={color} size={44} style={styles.icon} />
      <View style={styles.details}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>{amountText}</Text>
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(colors => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
    backgroundColor: colors.surface,
  },
  icon: {
    marginRight: THEME.spacing.md,
  },
  details: {
    flex: 1,
  },
  title: {
    ...THEME.typography.titleSmall,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    ...THEME.typography.caption,
    color: colors.textSecondary,
  },
  amount: {
    ...THEME.typography.titleSmall,
    fontWeight: '700',
    marginLeft: THEME.spacing.sm,
    fontVariant: ['tabular-nums'],
  },
}));
