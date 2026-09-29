import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, CustomModal, FormInput, FormLabel } from '../common';
import { THEME } from '../../constants';
import { useShoppingList } from '../../context';

const DEFAULT_LIST_NAME = 'Shopping list';

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
  const [description, setDescription] = useState('');

  const handleClose = () => {
    setListName('');
    setDescription('');
    onClose();
  };

  const handleSubmit = () => {
    const newList = createList(listName.trim() || DEFAULT_LIST_NAME, description.trim());
    handleClose();
    onListCreated?.(newList.id);
  };

  return (
    <CustomModal
      visible={visible}
      onClose={handleClose}
      title="Create New Shopping List"
      subtitle="Give it a name and, if you like, a short description"
    >
      <FormLabel>List Name</FormLabel>
      <FormInput
        placeholder="e.g. Weekly groceries"
        accessibilityLabel="List name"
        value={listName}
        onChangeText={setListName}
      />

      <FormLabel>Description (Optional)</FormLabel>
      <FormInput
        style={styles.descriptionInput}
        placeholder="e.g. Big shop for the weekend, party snacks..."
        accessibilityLabel="List description"
        value={description}
        onChangeText={setDescription}
        multiline
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
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  actionsContainer: {
    marginTop: THEME.spacing.xl,
    marginBottom: THEME.spacing.md,
  },
  submitBtn: {
    width: '100%',
  },
});
