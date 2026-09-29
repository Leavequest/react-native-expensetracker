import React from 'react';
import { Alert } from 'react-native';
import { SettingsGroup, SettingsRow, showSuccessToast } from '../../components/common';
import { OWNER_ONLY_CAPTION, useAppData, usePermission } from '../../context';
import { version } from '../../../package.json';

function confirm(title: string, message: string, actionLabel: string, destructive: boolean, onConfirm: () => void) {
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: actionLabel, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
}

export const AppDataSection: React.FC = () => {
  const { loadDemoData, deleteAllData } = useAppData();
  const canClear = usePermission('clearData').allowed;

  const handleLoadDemo = () =>
    confirm(
      'Load demo data?',
      'Your expenses, income, wallets and shopping lists will be replaced with sample data.',
      'Load',
      false,
      () => {
        loadDemoData();
        showSuccessToast('Demo data loaded');
      }
    );

  const handleDeleteAll = () =>
    confirm(
      'Delete all data?',
      'All expenses, income, transfers, wallets and shopping lists will be permanently deleted. Household members are kept.',
      'Delete',
      true,
      () => {
        deleteAllData();
        showSuccessToast('All data deleted');
      }
    );

  return (
    <SettingsGroup title="App & Data" caption="Demo data is a quick way to try every screen.">
      <SettingsRow
        label="Load demo data"
        onPress={handleLoadDemo}
        disabled={!canClear}
        disabledCaption={OWNER_ONLY_CAPTION}
      />
      <SettingsRow
        label="Delete all data"
        destructive
        accessory="none"
        onPress={handleDeleteAll}
        disabled={!canClear}
        disabledCaption={OWNER_ONLY_CAPTION}
      />
      <SettingsRow label="Version" value={version} />
      <SettingsRow label="Built with" value="React Native 0.87" />
    </SettingsGroup>
  );
};
