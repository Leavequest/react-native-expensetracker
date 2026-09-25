import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Chip, ChipRow, CustomModal, FormInput, FormLabel } from '../common';
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

  const resetForm = () => {
    setListName('');
    setSelectedStore(EUROPEAN_STORES[0]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSelectStore = (store: StorePreset) => {
    setSelectedStore(store);
    // Only replace the name if the user hasn't typed a custom one
    if (!listName || EUROPEAN_STORES.some(s => listName === `${s.name} Shopping`)) {
      setListName(`${store.name} Shopping`);
    }
  };

  const handleSubmit = () => {
    const finalName = listName.trim() || `${selectedStore.name} Shopping`;
    const newList = createList(finalName, selectedStore.name, selectedStore.color);
    handleClose();
    onListCreated?.(newList.id);
  };

  return (
    <CustomModal
      visible={visible}
      onClose={handleClose}
      title="Create New Shopping List"
      subtitle="Select a European supermarket preset"
    >
      <FormLabel>Select Supermarket</FormLabel>
      <ChipRow contentContainerStyle={styles.storesRow}>
        {EUROPEAN_STORES.map(store => (
          <Chip
            key={store.name}
            label={store.name}
            selected={selectedStore.name === store.name}
            selectedColor={store.color}
            onPress={() => handleSelectStore(store)}
          />
        ))}
      </ChipRow>

      <FormLabel>List Name</FormLabel>
      <FormInput
        placeholder={`e.g. ${selectedStore.name} Groceries`}
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
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  storesRow: {
    marginBottom: THEME.spacing.sm,
  },
  actionsContainer: {
    marginTop: THEME.spacing.xl,
    marginBottom: THEME.spacing.md,
  },
  submitBtn: {
    width: '100%',
  },
});
