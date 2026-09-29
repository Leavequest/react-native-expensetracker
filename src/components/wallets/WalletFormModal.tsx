import React, { useEffect, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import {
  Button,
  Chip,
  ChipRow,
  CustomModal,
  ErrorBanner,
  FormInput,
  FormLabel,
  showErrorToast,
  showSuccessToast,
} from '../common';
import { THEME } from '../../constants';
import { makeStyles, useUser, useWallet } from '../../context';
import { Wallet, WalletType } from '../../types';
import { AVATAR_COLORS, parseCurrencyInput } from '../../utils';

interface WalletFormModalProps {
  visible: boolean;
  /** Wallet being edited; null creates a new one */
  wallet: Wallet | null;
  onClose: () => void;
}

const REMOVED_MESSAGES = {
  deleted: 'Wallet deleted',
  archived: 'Wallet archived — its history is kept',
} as const;

export const WalletFormModal: React.FC<WalletFormModalProps> = ({ visible, wallet, onClose }) => {
  const styles = useStyles();
  const { activeUser, formatAmount } = useUser();
  const { addWallet, updateWallet, removeWallet, balances } = useWallet();

  const [name, setName] = useState('');
  const [type, setType] = useState<WalletType>('cash');
  const [color, setColor] = useState(AVATAR_COLORS[0].color);
  const [balanceInput, setBalanceInput] = useState('');
  const [error, setError] = useState('');

  // Start from the wallet's saved values (or blanks) every time the sheet opens
  useEffect(() => {
    if (!visible) return;
    setName(wallet?.name ?? '');
    setType(wallet?.type ?? 'cash');
    setColor(wallet?.color ?? AVATAR_COLORS[0].color);
    setBalanceInput(wallet ? String(wallet.openingBalance) : '');
    setError('');
  }, [visible, wallet]);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter a wallet name.');
      return;
    }
    const openingBalance = parseCurrencyInput(balanceInput);
    if (wallet) {
      updateWallet(wallet.id, { name: trimmedName, type, color, openingBalance });
      showSuccessToast('Wallet saved');
    } else {
      addWallet({ ownerId: activeUser.id, name: trimmedName, type, color, openingBalance });
      showSuccessToast('Wallet created');
    }
    onClose();
  };

  const handleDelete = () => {
    if (!wallet) return;
    Alert.alert(
      `Delete "${wallet.name}"?`,
      'Wallets that already have transactions are archived instead, so your history stays correct.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const result = removeWallet(wallet.id);
            if (result === 'blocked') {
              showErrorToast('You need at least one wallet.');
              return;
            }
            if (result === 'hasBalance') {
              showErrorToast(
                `Move the ${formatAmount(balances[wallet.id] ?? 0)} out of "${wallet.name}" first.`
              );
              return;
            }
            showSuccessToast(REMOVED_MESSAGES[result]);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      title={wallet ? 'Edit wallet' : 'New wallet'}
      subtitle={wallet ? undefined : 'Cash, a card, or a savings jar'}
    >
      <ErrorBanner message={error} />

      <FormLabel>Name</FormLabel>
      <FormInput
        placeholder="e.g., Pocket cash, Visa, Savings jar"
        accessibilityLabel="Wallet name"
        value={name}
        onChangeText={text => {
          setName(text);
          setError('');
        }}
      />

      <FormLabel>Type</FormLabel>
      <ChipRow>
        <Chip label="Cash" icon="money" selected={type === 'cash'} onPress={() => setType('cash')} />
        <Chip label="Card" icon="card" selected={type === 'card'} onPress={() => setType('card')} />
      </ChipRow>

      <FormLabel>Color</FormLabel>
      <View style={styles.swatches}>
        {AVATAR_COLORS.map(option => (
          <TouchableOpacity
            key={option.color}
            activeOpacity={0.7}
            onPress={() => setColor(option.color)}
            style={[
              styles.swatch,
              { backgroundColor: option.color },
              color === option.color && styles.swatchSelected,
            ]}
            accessibilityRole="radio"
            accessibilityState={{ checked: color === option.color }}
            accessibilityLabel={option.name}
          />
        ))}
      </View>

      <FormLabel>Opening balance</FormLabel>
      <FormInput
        placeholder="0.00"
        keyboardType="numbers-and-punctuation"
        accessibilityLabel="Opening balance"
        value={balanceInput}
        onChangeText={setBalanceInput}
      />

      <Button
        title={wallet ? 'Save wallet' : 'Create wallet'}
        onPress={handleSave}
        size="lg"
        style={styles.saveButton}
      />
      {wallet ? (
        <Button
          title="Delete wallet"
          variant="ghost"
          onPress={handleDelete}
          style={styles.deleteButton}
          textStyle={styles.deleteText}
        />
      ) : null}
    </CustomModal>
  );
};

const useStyles = makeStyles(colors => ({
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.md,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: colors.textPrimary,
  },
  saveButton: {
    width: '100%',
    marginTop: THEME.spacing.xl,
  },
  deleteButton: {
    width: '100%',
    marginTop: THEME.spacing.sm,
  },
  deleteText: {
    color: colors.danger,
  },
}));
