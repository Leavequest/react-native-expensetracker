import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  CustomModal,
  FormInput,
  showErrorToast,
  showSuccessToast,
} from '../../components/common';
import { THEME } from '../../constants';
import { useExpense, useUser } from '../../context';
import { parseCurrencyInput } from '../../utils';

interface BudgetModalProps {
  visible: boolean;
  onClose: () => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ visible, onClose }) => {
  const { budget, setTotalBudget } = useExpense();
  const { currency, formatAmount } = useUser();
  const [input, setInput] = useState('');

  // Start from the saved limit every time the sheet opens
  useEffect(() => {
    if (visible) setInput(budget.totalLimit > 0 ? String(budget.totalLimit) : '');
  }, [visible, budget.totalLimit]);

  const handleSave = () => {
    const parsed = parseCurrencyInput(input);
    if (parsed <= 0) {
      showErrorToast('Enter a budget amount greater than 0.');
      return;
    }
    setTotalBudget(parsed);
    showSuccessToast(`Monthly budget set to ${formatAmount(parsed)}`);
    onClose();
  };

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      title="Monthly budget"
      subtitle="How much the household plans to spend each month"
    >
      <FormInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        keyboardType="decimal-pad"
        placeholder="0.00"
        accessibilityLabel={`Monthly budget in ${currency}`}
      />
      <Button title="Save budget" onPress={handleSave} size="lg" style={styles.saveButton} />
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 18,
    fontWeight: '700',
  },
  saveButton: {
    width: '100%',
    marginTop: THEME.spacing.lg,
  },
});
