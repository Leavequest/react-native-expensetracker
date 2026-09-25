import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, FormInput } from '../../components/common';
import { THEME } from '../../constants';
import { useExpense, useUser } from '../../context';
import { parseCurrencyInput } from '../../utils';
import { SettingsSection } from './SettingsSection';

export const BudgetSection: React.FC = () => {
  const { budget, setTotalBudget } = useExpense();
  const { formatAmount } = useUser();

  const [budgetInput, setBudgetInput] = useState('');
  const [savedBanner, setSavedBanner] = useState(false);

  // Keep the field in sync when the budget changes elsewhere (e.g. "Clear All Data")
  useEffect(() => {
    setBudgetInput(budget.totalLimit > 0 ? String(budget.totalLimit) : '');
  }, [budget.totalLimit]);

  useEffect(() => {
    if (!savedBanner) return;
    const timer = setTimeout(() => setSavedBanner(false), 3000);
    return () => clearTimeout(timer);
  }, [savedBanner]);

  const handleSave = () => {
    const parsed = parseCurrencyInput(budgetInput);
    if (parsed > 0) {
      setTotalBudget(parsed);
      setSavedBanner(true);
    }
  };

  const currentLimit = budget.totalLimit > 0 ? formatAmount(budget.totalLimit) : 'Not set';

  return (
    <SettingsSection title="Monthly Budget Limit" description={`Current limit: ${currentLimit}`}>
      {savedBanner ? (
        <View style={styles.savedBanner}>
          <Text style={styles.savedBannerText}>Budget updated successfully! ✓</Text>
        </View>
      ) : null}

      <View style={styles.inputRow}>
        <FormInput
          style={styles.input}
          value={budgetInput}
          onChangeText={setBudgetInput}
          keyboardType="decimal-pad"
          placeholder="0.00"
        />
        <Button title="Save Limit" onPress={handleSave} size="md" style={styles.saveBtn} />
      </View>
    </SettingsSection>
  );
};

const styles = StyleSheet.create({
  savedBanner: {
    backgroundColor: THEME.colors.successLight,
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: THEME.spacing.sm,
  },
  savedBannerText: {
    color: THEME.colors.primaryDark,
    fontSize: 12,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  saveBtn: {
    paddingHorizontal: 20,
  },
});
