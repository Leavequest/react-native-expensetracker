import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  CustomModal,
  ErrorBanner,
  FormInput,
  FormLabel,
} from '../../components/common';
import { THEME } from '../../constants';
import { useUser } from '../../context';

interface AddMemberModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ visible, onClose }) => {
  const { addUser } = useUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    setName('');
    setEmail('');
    setError('');
    onClose();
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Please enter a name for the member.');
      return;
    }
    addUser(name.trim(), email.trim() || undefined);
    handleClose();
  };

  return (
    <CustomModal
      visible={visible}
      onClose={handleClose}
      title="Add Household Member"
      subtitle="Add a flatmate or family member to collaborate on shopping lists"
    >
      <View style={styles.content}>
        <ErrorBanner message={error} />

        <FormLabel style={styles.firstLabel}>Name / Nickname</FormLabel>
        <FormInput
          placeholder="e.g. Maria, Luca"
          value={name}
          onChangeText={t => {
            setName(t);
            setError('');
          }}
        />

        <FormLabel style={styles.label}>Email Address (Optional)</FormLabel>
        <FormInput
          placeholder="e.g. member@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.actions}>
          <Button title="Add Member" onPress={handleSubmit} size="lg" style={styles.submitBtn} />
        </View>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: THEME.spacing.md,
  },
  firstLabel: {
    marginTop: 0,
  },
  label: {
    marginTop: THEME.spacing.md,
  },
  actions: {
    marginTop: THEME.spacing.xl,
  },
  submitBtn: {
    width: '100%',
  },
});
