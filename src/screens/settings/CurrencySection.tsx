import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CURRENCIES, THEME } from '../../constants';
import { useUser } from '../../context';
import { CurrencyCode } from '../../types';
import { SettingsSection } from './SettingsSection';

const CURRENCY_OPTIONS = Object.keys(CURRENCIES) as CurrencyCode[];

export const CurrencySection: React.FC = () => {
  const { currency, setCurrency } = useUser();

  return (
    <SettingsSection
      title="Active Currency"
      description="Select the currency used across all balances, budgets, price tags, and shopping list estimates. Default is set to Euro (€) for the European market."
    >
      <View style={styles.row}>
        {CURRENCY_OPTIONS.map(code => {
          const config = CURRENCIES[code];
          const isSelected = currency === code;

          return (
            <TouchableOpacity
              key={code}
              activeOpacity={0.7}
              onPress={() => setCurrency(code)}
              accessibilityState={{ selected: isSelected }}
              style={[styles.option, isSelected && styles.optionActive]}
            >
              <View style={[styles.symbolCircle, isSelected && styles.symbolCircleActive]}>
                <Text style={[styles.symbolText, isSelected && styles.symbolTextActive]}>
                  {config.symbol}
                </Text>
              </View>
              <Text style={[styles.codeText, isSelected && styles.codeTextActive]}>
                {config.code}
              </Text>
              <Text style={styles.nameText}>{config.label}</Text>
              {isSelected ? (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>Active ✓</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </SettingsSection>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  option: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceBorder,
    padding: THEME.spacing.md,
    alignItems: 'center',
  },
  optionActive: {
    backgroundColor: THEME.colors.primaryLight,
    borderColor: THEME.colors.primary,
  },
  symbolCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  symbolCircleActive: {
    backgroundColor: THEME.colors.primary,
  },
  symbolText: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  symbolTextActive: {
    color: THEME.colors.textInverse,
  },
  codeText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  codeTextActive: {
    color: THEME.colors.primaryDark,
  },
  nameText: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  activeBadge: {
    marginTop: 6,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.full,
  },
  activeBadgeText: {
    color: THEME.colors.textInverse,
    fontSize: 9,
    fontWeight: '700',
  },
});
