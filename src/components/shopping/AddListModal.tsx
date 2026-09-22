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
import { EUROPEAN_STORES, StorePreset, THEME } from '../../constants';
import { useShoppingList } from '../../context';

interface AddListModalProps {
  visible: boolean;
  onClose: () => void;
  onListCreated?: (listId: string) => void;
}

export const AddListModal: React.FC<AddListModalProps> = ({
  visible,
  onClose,
  onListCreated,
}) => {
  const { createList } = useShoppingList();

  const [listName, setListName] = useState('');
  const [selectedStore, setSelectedStore] = useState<StorePreset>(EUROPEAN_STORES[0]);
  const [error, setError] = useState('');

  const resetForm = () => {
    setListName('');
    setSelectedStore(EUROPEAN_STORES[0]);
    setError('');
  };

  const handleSelectStore = (store: StorePreset) => {
    setSelectedStore(store);
    if (!listName || EUROPEAN_STORES.some(s => s.name === listName)) {
      setListName(`${store.name} Shopping`);
    }
  };

  const handleSubmit = () => {
    const finalName = listName.trim() || `${selectedStore.name} Shopping`;

    const newList = createList(finalName, selectedStore.name, selectedStore.color);
    resetForm();
    onClose();
    if (onListCreated) {
      onListCreated(newList.id);
    }
  };

  return (
    <CustomModal
      visible={visible}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Create New Shopping List"
      subtitle="Select a European supermarket preset"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

        {/* Store Preset Selector */}
        <Text style={styles.label}>Select Supermarket</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storesRow}
        >
          {EUROPEAN_STORES.map(store => {
            const isSelected = selectedStore.name === store.name;
            return (
              <TouchableOpacity
                key={store.name}
                activeOpacity={0.7}
                onPress={() => handleSelectStore(store)}
                style={[
                  styles.storeChip,
                  isSelected && {
                    backgroundColor: store.color,
                    borderColor: store.color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.storeChipText,
                    isSelected && styles.storeChipTextSelected,
                  ]}
                >
                  {store.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* List Name */}
        <Text style={styles.label}>List Name</Text>
        <TextInput
          style={styles.input}
          placeholder={`e.g. ${selectedStore.name} Groceries`}
          placeholderTextColor={THEME.colors.textMuted}
          value={listName}
          onChangeText={setListName}
        />

        <View style={styles.actionsContainer}>
          <Button
            title="Create Shopping List"
            onPress={handleSubmit}
            size="lg"
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  errorBanner: {
    backgroundColor: THEME.colors.dangerLight,
    color: THEME.colors.danger,
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: THEME.spacing.md,
    fontSize: 13,
  },
  label: {
    ...THEME.typography.captionBold,
    color: THEME.colors.textSecondary,
    marginBottom: 6,
    marginTop: THEME.spacing.sm,
    textTransform: 'uppercase',
  },
  storesRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
    marginBottom: THEME.spacing.sm,
  },
  storeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  storeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  storeChipTextSelected: {
    color: '#FFFFFF',
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
  actionsContainer: {
    marginTop: THEME.spacing.xl,
    marginBottom: THEME.spacing.md,
  },
  submitBtn: {
    width: '100%',
  },
});
