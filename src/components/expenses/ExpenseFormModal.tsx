import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  Button,
  Chip,
  ChipRow,
  CustomModal,
  ErrorBanner,
  FormInput,
  FormLabel,
} from '../common';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, THEME } from '../../constants';
import { ExpenseCategory, PaymentMethod } from '../../types';
import { useExpense, useUser } from '../../context';
import { getCurrencySymbol, parseCurrencyInput } from '../../utils';

interface ExpenseFormModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  visible,
  onClose,
}) => {
  const { addExpense } = useExpense();
  const { activeUser, currency } = useUser();

  const [title, setTitle] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<ExpenseCategory>('Groceries');
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>('Debit Card');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const currencySymbol = getCurrencySymbol(currency);

  const resetForm = () => {
    setTitle('');
    setAmountInput('');
    setSelectedCategory('Groceries');
    setSelectedPaymentMethod('Debit Card');
    setNotes('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Please enter a description or store name.');
      return;
    }

    const parsedAmount = parseCurrencyInput(amountInput);
    if (parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    addExpense({
      title: title.trim(),
      amount: parsedAmount,
      category: selectedCategory,
      paymentMethod: selectedPaymentMethod,
      date: new Date().toISOString(),
      paidByUserId: activeUser.id,
      notes: notes.trim() || undefined,
    });

    handleClose();
  };

  return (
    <CustomModal
      visible={visible}
      onClose={handleClose}
      title="Add New Expense"
      subtitle="Log a transaction in your monthly budget"
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.formContainer}>
        <ErrorBanner message={error} />

        <FormLabel>Description / Store Name</FormLabel>
        <FormInput
          placeholder="e.g., Carrefour, Metro Pass, Dinner"
          value={title}
          onChangeText={t => {
            setTitle(t);
            setError('');
          }}
        />

        <FormLabel>Amount ({currencySymbol})</FormLabel>
        <View style={styles.amountInputRow}>
          <Text style={styles.currencyPrefix}>{currencySymbol}</Text>
          <FormInput
            style={styles.amountInput}
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={amountInput}
            onChangeText={a => {
              setAmountInput(a);
              setError('');
            }}
          />
        </View>

        <FormLabel>Category</FormLabel>
        <ChipRow>
          {EXPENSE_CATEGORIES.map(cat => (
            <Chip
              key={cat.name}
              label={cat.name}
              icon={cat.icon}
              selected={selectedCategory === cat.name}
              selectedColor={cat.color}
              onPress={() => setSelectedCategory(cat.name)}
            />
          ))}
        </ChipRow>

        <FormLabel>Payment Method</FormLabel>
        <ChipRow>
          {PAYMENT_METHODS.map(pm => (
            <Chip
              key={pm}
              label={pm}
              selected={selectedPaymentMethod === pm}
              onPress={() => setSelectedPaymentMethod(pm)}
            />
          ))}
        </ChipRow>

        <FormLabel>Notes (Optional)</FormLabel>
        <FormInput
          style={styles.notesInput}
          placeholder="Add optional notes..."
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <View style={styles.actionsContainer}>
          <Button
            title="Add Expense"
            onPress={handleSubmit}
            size="lg"
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    maxHeight: 500,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyPrefix: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  amountInput: {
    flex: 1,
    paddingLeft: 34,
    fontSize: 18,
    fontWeight: '700',
  },
  notesInput: {
    height: 70,
    textAlignVertical: 'top',
  },
  actionsContainer: {
    marginTop: THEME.spacing.xl,
    marginBottom: THEME.spacing.md,
  },
  submitButton: {
    width: '100%',
  },
});
