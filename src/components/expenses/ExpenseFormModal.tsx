import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { CustomModal, Button } from '../common';
import {
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
  THEME,
} from '../../constants';
import { ExpenseCategory, PaymentMethod } from '../../types';
import { useExpense, useUser } from '../../context';
import { parseCurrencyInput } from '../../utils';

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

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£';

  const resetForm = () => {
    setTitle('');
    setAmountInput('');
    setSelectedCategory('Groceries');
    setSelectedPaymentMethod('Debit Card');
    setNotes('');
    setError('');
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

    resetForm();
    onClose();
  };

  return (
    <CustomModal
      visible={visible}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Add New Expense"
      subtitle="Log a transaction in your monthly budget"
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.formContainer}>
        {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

        {/* Title */}
        <Text style={styles.label}>Description / Store Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Carrefour, Metro Pass, Dinner"
          placeholderTextColor={THEME.colors.textMuted}
          value={title}
          onChangeText={t => {
            setTitle(t);
            setError('');
          }}
        />

        {/* Amount */}
        <Text style={styles.label}>Amount ({currencySymbol})</Text>
        <View style={styles.amountInputRow}>
          <Text style={styles.currencyPrefix}>{currencySymbol}</Text>
          <TextInput
            style={[styles.input, styles.amountInput]}
            placeholder="0.00"
            placeholderTextColor={THEME.colors.textMuted}
            keyboardType="decimal-pad"
            value={amountInput}
            onChangeText={a => {
              setAmountInput(a);
              setError('');
            }}
          />
        </View>

        {/* Category Picker */}
        <Text style={styles.label}>Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {EXPENSE_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.name}
                activeOpacity={0.7}
                onPress={() => setSelectedCategory(cat.name)}
                style={[
                  styles.chip,
                  isSelected && {
                    backgroundColor: cat.color,
                    borderColor: cat.color,
                  },
                ]}
              >
                <Text style={styles.chipIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Payment Method */}
        <Text style={styles.label}>Payment Method</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {PAYMENT_METHODS.map(pm => {
            const isSelected = selectedPaymentMethod === pm;
            return (
              <TouchableOpacity
                key={pm}
                activeOpacity={0.7}
                onPress={() => setSelectedPaymentMethod(pm)}
                style={[
                  styles.chip,
                  isSelected && styles.chipSelectedPrimary,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {pm}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Notes */}
        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Add optional notes..."
          placeholderTextColor={THEME.colors.textMuted}
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
  errorBanner: {
    backgroundColor: THEME.colors.dangerLight,
    color: THEME.colors.danger,
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: THEME.spacing.md,
    fontSize: 13,
    fontWeight: '500',
  },
  label: {
    ...THEME.typography.captionBold,
    color: THEME.colors.textSecondary,
    marginBottom: 6,
    marginTop: THEME.spacing.sm,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm + 2,
    fontSize: 15,
    color: THEME.colors.textPrimary,
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
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  chipSelectedPrimary: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  chipIcon: {
    marginRight: 6,
    fontSize: 14,
  },
  chipText: {
    fontSize: 13,
    color: THEME.colors.textPrimary,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
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
