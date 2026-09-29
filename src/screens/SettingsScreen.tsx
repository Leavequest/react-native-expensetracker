import React from 'react';
import { View, ScrollView } from 'react-native';
import { Header } from '../components/common';
import { CurrencySection } from './settings/CurrencySection';
import { HouseholdSection } from './settings/HouseholdSection';
import { BudgetSection } from './settings/BudgetSection';
import { AppDataSection } from './settings/AppDataSection';
import { makeStyles } from '../context';

export const SettingsScreen: React.FC = () => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Header title="Settings" subtitle="Currency, household & preferences" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CurrencySection />
        <HouseholdSection />
        <BudgetSection />
        <AppDataSection />
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles(colors => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
}));
