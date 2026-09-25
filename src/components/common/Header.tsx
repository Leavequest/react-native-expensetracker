import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CURRENCIES, THEME } from '../../constants';
import { useUser } from '../../context';
import { CurrencyCode } from '../../types';
import { Avatar } from './Avatar';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showCurrencyPill?: boolean;
  onCurrencyPress?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showCurrencyPill = true,
  onCurrencyPress,
  rightAction,
}) => {
  const { activeUser, currency, setCurrency } = useUser();

  const handleCycleCurrency = () => {
    if (onCurrencyPress) {
      onCurrencyPress();
      return;
    }
    // Cycle through all supported currencies
    const sequence = Object.keys(CURRENCIES) as CurrencyCode[];
    const nextIndex = (sequence.indexOf(currency) + 1) % sequence.length;
    setCurrency(sequence[nextIndex]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.rightSection}>
        {showCurrencyPill ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCycleCurrency}
            style={styles.currencyPill}
          >
            <Text style={styles.currencySymbol}>{CURRENCIES[currency].symbol}</Text>
            <Text style={styles.currencyText}>{currency}</Text>
          </TouchableOpacity>
        ) : null}

        <Avatar user={activeUser} size={32} style={styles.avatar} />

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
  currencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  currencySymbol: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.primaryDark,
    marginRight: 3,
  },
  currencyText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.primaryDark,
  },
  avatar: {
    marginLeft: 4,
  },
  actionWrapper: {
    marginLeft: 4,
  },
});
