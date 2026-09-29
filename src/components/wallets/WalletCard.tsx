import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../constants';
import { makeStyles, useTheme, useUser } from '../../context';
import { Icon, IconName } from '../common';

export const WALLET_CARD_WIDTH = 150;

interface WalletCardProps {
  name: string;
  balance: number;
  icon: IconName;
  color: string;
  selected: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}

/** One card of the wallet carousel: color accent, name and current balance. */
export const WalletCard: React.FC<WalletCardProps> = ({
  name,
  balance,
  icon,
  color,
  selected,
  onPress,
  onLongPress,
}) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const { formatAmount } = useUser();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={350}
      style={[styles.card, selected && { borderColor: color }]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${name}, ${formatAmount(balance)}`}
      accessibilityHint={onLongPress ? 'Long press to edit' : undefined}
    >
      <View style={[styles.accent, { backgroundColor: color }]} />
      <View style={styles.titleRow}>
        <Icon name={icon} size={16} color={color} />
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
      </View>
      <Text
        style={[styles.balance, balance < 0 && { color: colors.danger }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {formatAmount(balance)}
      </Text>
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(colors => ({
  card: {
    width: WALLET_CARD_WIDTH,
    padding: THEME.spacing.md,
    paddingTop: THEME.spacing.md + 4,
    gap: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.surfaceBorder,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    ...THEME.typography.captionBold,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  balance: {
    ...THEME.typography.titleMedium,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
}));
