import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, FormInput, showErrorToast, showSuccessToast } from '../../components/common';
import { useExpense, useUser } from '../../context';
import { parseCurrencyInput } from '../../utils';
import { SettingsSection } from './SettingsSection';

export const BudgetSection: React.FC = () => {
  const { budget, setTotalBudget } = useExpense();
  const { formatAmount } = useUser();

  const [budgetInput, setBudgetInput] = useState('');

  // Keep the field in sync when the budget changes elsewhere (e.g. "Clear All Data")
  useEffect(() => {
    setBudgetInput(budget.totalLimit > 0 ? String(budget.totalLimit) : '');
  }, [budget.totalLimit]);

  const handleSave = () => {
    const parsed = parseCurrencyInput(budgetInput);
    if (parsed > 0) {
      setTotalBudget(parsed);
      showSuccessToast(`Monthly budget set to ${formatAmount(parsed)}`);
    } else {
      showErrorToast('Enter a budget amount greater than 0.');
    }
  };

  const currentLimit = budget.totalLimit > 0 ? formatAmount(budget.totalLimit) : 'Not set';

  return (
    <SettingsSection title="Monthly Budget Limit" description={`Current limit: ${currentLimit}`}>
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
