import React, { useState } from 'react';
import { Switch } from 'react-native';
import { SettingsGroup, SettingsRow } from '../../components/common';
import { CURRENCIES } from '../../constants';
import { OWNER_ONLY_CAPTION, useExpense, usePermission, useTheme, useUser } from '../../context';
import { BudgetModal } from './BudgetModal';
import { CurrencyPickerModal } from './CurrencyPickerModal';

export const PreferencesSection: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { currency, formatAmount } = useUser();
  const { budget } = useExpense();
  const canSetBudget = usePermission('setBudget').allowed;

  const [currencyVisible, setCurrencyVisible] = useState(false);
  const [budgetVisible, setBudgetVisible] = useState(false);

  return (
    <>
      <SettingsGroup title="Preferences">
        <SettingsRow
          label="Currency"
          value={`${currency} ${CURRENCIES[currency].symbol}`}
          onPress={() => setCurrencyVisible(true)}
        />
        <SettingsRow
          label="Dark mode"
          accessory="none"
          accessibilityRole="switch"
          accessibilityState={{ checked: isDark }}
          onPress={toggleTheme}
          right={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ true: colors.primary, false: colors.surfaceBorder }}
              thumbColor="#FFFFFF"
              // The row already announces and toggles the setting
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            />
          }
        />
        <SettingsRow
          label="Monthly budget"
          value={budget.totalLimit > 0 ? formatAmount(budget.totalLimit) : 'Not set'}
          onPress={() => setBudgetVisible(true)}
          disabled={!canSetBudget}
          disabledCaption={OWNER_ONLY_CAPTION}
        />
      </SettingsGroup>

      <CurrencyPickerModal visible={currencyVisible} onClose={() => setCurrencyVisible(false)} />
      <BudgetModal visible={budgetVisible} onClose={() => setBudgetVisible(false)} />
    </>
  );
};
