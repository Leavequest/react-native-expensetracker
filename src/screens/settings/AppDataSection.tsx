import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/common';
import { DEFAULT_CURRENCY, THEME } from '../../constants';
import { useExpense, useShoppingList, useUser } from '../../context';
import { SettingsSection } from './SettingsSection';

const APP_INFO: Array<[label: string, value: string]> = [
  ['Architecture', 'React Native'],
  ['React Version', '19.2.3'],
  ['React Native', '0.87.1'],
  ['Market Region', 'Europe (EUR € default)'],
];

export const AppDataSection: React.FC = () => {
  const { householdUsers, setCurrency, setActiveUser } = useUser();
  const { resetExpensesToDefault } = useExpense();
  const { resetShoppingListsToDefault } = useShoppingList();

  const handleResetData = () => {
    Alert.alert(
      'Clear all data?',
      'All expenses, budgets and shopping lists will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: () => {
            resetExpensesToDefault();
            resetShoppingListsToDefault();
            setCurrency(DEFAULT_CURRENCY);
            setActiveUser(householdUsers[0].id);
          },
        },
      ]
    );
  };

  return (
    <SettingsSection title="App & Data">
      {APP_INFO.map(([label, value]) => (
        <View key={label} style={styles.infoRow}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      ))}

      <Button
        title="Clear All Data"
        variant="outline"
        onPress={handleResetData}
        style={styles.resetBtn}
        textStyle={styles.resetBtnText}
      />
    </SettingsSection>
  );
};

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceBorder,
  },
  infoLabel: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
  },
  infoValue: {
    ...THEME.typography.captionBold,
    color: THEME.colors.textPrimary,
  },
  resetBtn: {
    marginTop: THEME.spacing.lg,
    borderColor: THEME.colors.danger,
  },
  resetBtnText: {
    color: THEME.colors.danger,
  },
});
