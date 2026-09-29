import React, { useState } from 'react';
import { View, Text } from 'react-native';
import {
  Button,
  Chip,
  ChipRow,
  CustomModal,
  ErrorBanner,
  FormInput,
  FormLabel,
} from '../common';
import { PAYMENT_METHODS, THEME } from '../../constants';
import { ExpenseCategory, PaymentMethod } from '../../types';
import { useExpense, useUser, makeStyles } from '../../context';
import { getCurrencySymbol, parseCurrencyInput } from '../../utils';
import { CategoryGrid } from './CategoryGrid';

interface ExpenseFormModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  visible,
  onClose,
}) => {
  const styles = useStyles();
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
    const parsedAmount = parseCurrencyInput(amountInput);
    if (parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a description or store name.');
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
      <ErrorBanner message={error} />

      {/* Amount first: it's the one field every expense needs */}
      <View style={styles.amountRow}>
        <Text style={styles.currencySymbol}>{currencySymbol}</Text>
        <FormInput
          style={styles.amountInput}
          placeholder="0.00"
          keyboardType="decimal-pad"
          autoFocus
          accessibilityLabel={`Amount in ${currency}`}
          value={amountInput}
          onChangeText={a => {
            setAmountInput(a);
            setError('');
          }}
        />
      </View>

      <FormLabel>Category</FormLabel>
      <CategoryGrid selected={selectedCategory} onSelect={setSelectedCategory} />

      <FormLabel>Description / Store Name</FormLabel>
      <FormInput
        placeholder="e.g., Carrefour, Metro Pass, Dinner"
        value={title}
        onChangeText={t => {
          setTitle(t);
          setError('');
        }}
      />

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

      <Button
        title="Add Expense"
        onPress={handleSubmit}
        size="lg"
        style={styles.submitButton}
      />
    </CustomModal>
  );
};

const useStyles = makeStyles(colors => ({
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.sm,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textSecondary,
    marginRight: THEME.spacing.sm,
  },
  amountInput: {
    minWidth: 160,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    borderRadius: 0,
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
    paddingVertical: THEME.spacing.xs,
  },
  notesInput: {
    height: 70,
    textAlignVertical: 'top',
  },
  submitButton: {
    width: '100%',
    marginTop: THEME.spacing.xl,
  },
}));
