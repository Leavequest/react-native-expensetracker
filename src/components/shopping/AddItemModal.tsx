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
  GROCERY_AISLES,
  QUICK_GROCERY_ITEMS,
  QuickGroceryPreset,
  THEME,
} from '../../constants';
import { GroceryAisle } from '../../types';
import { useShoppingList, useUser } from '../../context';
import { parseCurrencyInput } from '../../utils';

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

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£';

  const resetForm = () => {
    setName('');
    setQuantity('1');
    setEstimatedPriceInput('');
    setSelectedAisle('Fresh Produce');
    setAssignedUserId(activeUser.id);
    setError('');
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

    addItem(listId, {
      name: name.trim(),
      quantity: quantity.trim() || '1',
      estimatedPrice: price > 0 ? price : undefined,
      aisle: selectedAisle,
      assignedToUserId: assignedUserId || undefined,
      addedByUserId: activeUser.id,
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
      title="Add Item to List"
      subtitle="Select popular groceries or type a custom item"
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.formContainer}>
        {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

        {/* Quick Presets */}
        <Text style={styles.label}>Quick Presets</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.presetsRow}
        >
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
        </ScrollView>

        {/* Item Name */}
        <Text style={styles.label}>Item Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Greek Yogurt, Tomatoes, Eggs"
          placeholderTextColor={THEME.colors.textMuted}
          value={name}
          onChangeText={t => {
            setName(t);
            setError('');
          }}
        />

        {/* Quantity and Price Row */}
        <View style={styles.rowInputs}>
          <View style={styles.flexHalf}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 2L, 500g, 1 pk"
              placeholderTextColor={THEME.colors.textMuted}
              value={quantity}
              onChangeText={setQuantity}
            />
          </View>

          <View style={styles.flexHalf}>
            <Text style={styles.label}>Est. Price ({currencySymbol})</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={THEME.colors.textMuted}
              keyboardType="decimal-pad"
              value={estimatedPriceInput}
              onChangeText={setEstimatedPriceInput}
            />
          </View>
        </View>

        {/* Aisle Selection */}
        <Text style={styles.label}>Aisle / Section</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {GROCERY_AISLES.map(aisle => {
            const isSelected = selectedAisle === aisle.name;
            return (
              <TouchableOpacity
                key={aisle.name}
                activeOpacity={0.7}
                onPress={() => setSelectedAisle(aisle.name)}
                style={[
                  styles.chip,
                  isSelected && {
                    backgroundColor: aisle.color,
                    borderColor: aisle.color,
                  },
                ]}
              >
                <Text style={styles.chipIcon}>{aisle.icon}</Text>
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {aisle.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Assignee Selection */}
        <Text style={styles.label}>Assign to Member</Text>
        <View style={styles.assigneeRow}>
          {householdUsers.map(user => {
            const isSelected = assignedUserId === user.id;
            return (
              <TouchableOpacity
                key={user.id}
                activeOpacity={0.7}
                onPress={() =>
                  setAssignedUserId(isSelected ? undefined : user.id)
                }
                style={[
                  styles.assigneeChip,
                  isSelected && styles.assigneeChipSelected,
                ]}
              >
                <View
                  style={[
                    styles.assigneeAvatar,
                    { backgroundColor: user.avatarColor },
                  ]}
                >
                  <Text style={styles.assigneeInitials}>{user.initials}</Text>
                </View>
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
  presetsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
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
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  flexHalf: {
    flex: 1,
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
  assigneeAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assigneeInitials: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
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
