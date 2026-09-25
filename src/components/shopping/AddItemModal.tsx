import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  Avatar,
  Button,
  Chip,
  ChipRow,
  CustomModal,
  ErrorBanner,
  FormInput,
  FormLabel,
} from '../common';
import {
  GROCERY_AISLES,
  QUICK_GROCERY_ITEMS,
  QuickGroceryPreset,
  THEME,
} from '../../constants';
import { GroceryAisle } from '../../types';
import { useShoppingList, useUser } from '../../context';
import { getCurrencySymbol, parseCurrencyInput } from '../../utils';

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  listId: string;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onClose,
  listId,
}) => {
  const { addItem } = useShoppingList();
  const { activeUser, householdUsers, currency } = useUser();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [estimatedPriceInput, setEstimatedPriceInput] = useState('');
  const [selectedAisle, setSelectedAisle] =
    useState<GroceryAisle>('Fresh Produce');
  const [assignedUserId, setAssignedUserId] = useState<string | undefined>(
    activeUser.id
  );
  const [error, setError] = useState('');

  const currencySymbol = getCurrencySymbol(currency);

  const resetForm = () => {
    setName('');
    setQuantity('1');
    setEstimatedPriceInput('');
    setSelectedAisle('Fresh Produce');
    setAssignedUserId(activeUser.id);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSelectPreset = (preset: QuickGroceryPreset) => {
    setName(preset.name);
    setSelectedAisle(preset.aisle);
    setEstimatedPriceInput(preset.defaultPrice.toFixed(2));
    setQuantity(preset.quantity);
    setError('');
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Please provide an item name.');
      return;
    }

    const price = parseCurrencyInput(estimatedPriceInput);
    // Ignore an assignee who was removed from the household while the form was open
    const assignee = householdUsers.some(u => u.id === assignedUserId)
      ? assignedUserId
      : undefined;

    addItem(listId, {
      name: name.trim(),
      quantity: quantity.trim() || '1',
      estimatedPrice: price > 0 ? price : undefined,
      aisle: selectedAisle,
      assignedToUserId: assignee,
      addedByUserId: activeUser.id,
    });

    handleClose();
  };

  return (
    <CustomModal
      visible={visible}
      onClose={handleClose}
      title="Add Item to List"
      subtitle="Select popular groceries or type a custom item"
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.formContainer}>
        <ErrorBanner message={error} />

        <FormLabel>Quick Presets</FormLabel>
        <ChipRow contentContainerStyle={styles.presetsRow}>
          {QUICK_GROCERY_ITEMS.map(preset => (
            <TouchableOpacity
              key={preset.name}
              activeOpacity={0.7}
              onPress={() => handleSelectPreset(preset)}
              style={styles.presetChip}
            >
              <Text style={styles.presetText}>{preset.name}</Text>
            </TouchableOpacity>
          ))}
        </ChipRow>

        <FormLabel>Item Name</FormLabel>
        <FormInput
          placeholder="e.g. Greek Yogurt, Tomatoes, Eggs"
          value={name}
          onChangeText={t => {
            setName(t);
            setError('');
          }}
        />

        <View style={styles.rowInputs}>
          <View style={styles.flexHalf}>
            <FormLabel>Quantity</FormLabel>
            <FormInput
              placeholder="e.g., 2L, 500g, 1 pk"
              value={quantity}
              onChangeText={setQuantity}
            />
          </View>

          <View style={styles.flexHalf}>
            <FormLabel>Est. Price ({currencySymbol})</FormLabel>
            <FormInput
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={estimatedPriceInput}
              onChangeText={setEstimatedPriceInput}
            />
          </View>
        </View>

        <FormLabel>Aisle / Section</FormLabel>
        <ChipRow>
          {GROCERY_AISLES.map(aisle => (
            <Chip
              key={aisle.name}
              label={aisle.name}
              icon={aisle.icon}
              selected={selectedAisle === aisle.name}
              selectedColor={aisle.color}
              onPress={() => setSelectedAisle(aisle.name)}
            />
          ))}
        </ChipRow>

        <FormLabel>Assign to Member</FormLabel>
        <View style={styles.assigneeRow}>
          {householdUsers.map(user => {
            const isSelected = assignedUserId === user.id;
            return (
              <TouchableOpacity
                key={user.id}
                activeOpacity={0.7}
                onPress={() => setAssignedUserId(isSelected ? undefined : user.id)}
                accessibilityState={{ selected: isSelected }}
                style={[styles.assigneeChip, isSelected && styles.assigneeChipSelected]}
              >
                <Avatar user={user} size={20} />
                <Text
                  style={[
                    styles.assigneeNameText,
                    isSelected && styles.assigneeNameTextSelected,
                  ]}
                >
                  {user.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Add to Shopping List"
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
    maxHeight: 520,
  },
  presetsRow: {
    gap: 6,
    marginBottom: 8,
  },
  presetChip: {
    backgroundColor: THEME.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.primaryDark,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  flexHalf: {
    flex: 1,
  },
  assigneeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  assigneeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    borderRadius: THEME.borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  assigneeChipSelected: {
    backgroundColor: THEME.colors.primaryLight,
    borderColor: THEME.colors.primary,
  },
  assigneeNameText: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    fontWeight: '500',
  },
  assigneeNameTextSelected: {
    color: THEME.colors.primaryDark,
    fontWeight: '700',
  },
  actionsContainer: {
    marginTop: THEME.spacing.xl,
    marginBottom: THEME.spacing.md,
  },
  submitButton: {
    width: '100%',
  },
});
