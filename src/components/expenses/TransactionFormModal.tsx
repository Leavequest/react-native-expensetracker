import React, { useState } from 'react';
import { Text, View } from 'react-native';
import {
  Button,
  Chip,
  ChipRow,
  CustomModal,
  ErrorBanner,
  FormInput,
  FormLabel,
} from '../common';
import { THEME } from '../../constants';
import { makeStyles, useExpense, useUser, useWallet } from '../../context';
import { ExpenseCategory, Wallet } from '../../types';
import { getCurrencySymbol, parseCurrencyInput } from '../../utils';
import { CategoryGrid } from './CategoryGrid';

export type TransactionMode = 'expense' | 'income' | 'transfer';

const MODES: Array<{ value: TransactionMode; label: string }> = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
  { value: 'transfer', label: 'Transfer' },
];

const SUBMIT_LABELS: Record<TransactionMode, string> = {
  expense: 'Add Expense',
  income: 'Add Income',
  transfer: 'Add Transfer',
};

interface WalletPickerProps {
  wallets: Wallet[];
  selectedId: string;
  onSelect: (walletId: string) => void;
}

const WalletPicker: React.FC<WalletPickerProps> = ({ wallets, selectedId, onSelect }) => (
  <ChipRow>
    {wallets.map(wallet => (
      <Chip
        key={wallet.id}
        label={wallet.name}
        icon={wallet.type === 'cash' ? 'money' : 'card'}
        selected={wallet.id === selectedId}
        selectedColor={wallet.color}
        onPress={() => onSelect(wallet.id)}
      />
    ))}
  </ChipRow>
);

interface TransactionFormModalProps {
  visible: boolean;
  onClose: () => void;
  /** Wallet preselected in the pickers, e.g. the one selected in the carousel */
  defaultWalletId?: string;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  visible,
  onClose,
  defaultWalletId,
}) => {
  const styles = useStyles();
  const { addExpense } = useExpense();
  const { activeUser, currency } = useUser();
  const { walletsOf, addIncome, addTransfer } = useWallet();
  const wallets = walletsOf(activeUser.id);

  const [mode, setMode] = useState<TransactionMode>('expense');
  const [amountInput, setAmountInput] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Groceries');
  const [walletId, setWalletId] = useState('');
  const [toWalletId, setToWalletId] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // An unset or no-longer-available choice falls back to a sensible wallet
  const isOwnWallet = (id?: string) => !!id && wallets.some(w => w.id === id);
  const fromId = isOwnWallet(walletId)
    ? walletId
    : isOwnWallet(defaultWalletId)
      ? defaultWalletId!
      : wallets[0]?.id ?? '';
  const toId = isOwnWallet(toWalletId)
    ? toWalletId
    : wallets.find(w => w.id !== fromId)?.id ?? '';

  const resetForm = () => {
    setMode('expense');
    setAmountInput('');
    setTitle('');
    setCategory('Groceries');
    setWalletId('');
    setToWalletId('');
    setNotes('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    const amount = parseCurrencyInput(amountInput);
    if (amount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    const date = new Date().toISOString();
    const trimmedNotes = notes.trim() || undefined;

    if (mode === 'transfer') {
      if (wallets.length < 2) {
        setError('Add a second wallet to move money between wallets.');
        return;
      }
      if (fromId === toId) {
        setError('Choose two different wallets.');
        return;
      }
      addTransfer({ fromWalletId: fromId, toWalletId: toId, amount, date, notes: trimmedNotes });
    } else {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        setError(
          mode === 'expense'
            ? 'Please enter a description or store name.'
            : 'Please enter where the money came from.'
        );
        return;
      }
      if (mode === 'expense') {
        addExpense({
          title: trimmedTitle,
          amount,
          category,
          walletId: fromId,
          date,
          paidByUserId: activeUser.id,
          notes: trimmedNotes,
        });
      } else {
        addIncome({ title: trimmedTitle, amount, walletId: fromId, date, notes: trimmedNotes });
      }
    }
    handleClose();
  };

  return (
    <CustomModal
      visible={visible}
      onClose={handleClose}
      title="Add Transaction"
      subtitle="An expense, income, or a move between wallets"
    >
      <ChipRow contentContainerStyle={styles.modes}>
        {MODES.map(option => (
          <Chip
            key={option.value}
            label={option.label}
            selected={mode === option.value}
            onPress={() => {
              setMode(option.value);
              setError('');
            }}
          />
        ))}
      </ChipRow>

      <ErrorBanner message={error} />

      {/* No autoFocus: the keyboard only opens when the user taps a field */}
      <View style={styles.amountRow}>
        <Text style={styles.currencySymbol}>{getCurrencySymbol(currency)}</Text>
        <FormInput
          style={styles.amountInput}
          placeholder="0.00"
          keyboardType="decimal-pad"
          accessibilityLabel={`Amount in ${currency}`}
          value={amountInput}
          onChangeText={text => {
            setAmountInput(text);
            setError('');
          }}
        />
      </View>

      {mode === 'expense' ? (
        <>
          <FormLabel>Category</FormLabel>
          <CategoryGrid selected={category} onSelect={setCategory} />
        </>
      ) : null}

      {mode !== 'transfer' ? (
        <>
          <FormLabel>{mode === 'expense' ? 'Description / Store Name' : 'Source'}</FormLabel>
          <FormInput
            accessibilityLabel="Description"
            placeholder={
              mode === 'expense' ? 'e.g., Carrefour, Metro Pass, Dinner' : 'e.g., Salary, Gift, Refund'
            }
            value={title}
            onChangeText={text => {
              setTitle(text);
              setError('');
            }}
          />
        </>
      ) : null}

      <FormLabel>{mode === 'transfer' ? 'From' : 'Wallet'}</FormLabel>
      <WalletPicker wallets={wallets} selectedId={fromId} onSelect={setWalletId} />

      {mode === 'transfer' ? (
        <>
          <FormLabel>To</FormLabel>
          <WalletPicker wallets={wallets} selectedId={toId} onSelect={setToWalletId} />
        </>
      ) : null}

      <FormLabel>Notes (Optional)</FormLabel>
      <FormInput
        style={styles.notesInput}
        placeholder="Add optional notes..."
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <Button title={SUBMIT_LABELS[mode]} onPress={handleSubmit} size="lg" style={styles.submitButton} />
    </CustomModal>
  );
};

const useStyles = makeStyles(colors => ({
  modes: {
    marginBottom: THEME.spacing.md,
  },
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
