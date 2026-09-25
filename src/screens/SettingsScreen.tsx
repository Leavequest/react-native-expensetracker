import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../components/common';
import { THEME } from '../constants';
import { CurrencySection } from './settings/CurrencySection';
import { HouseholdSection } from './settings/HouseholdSection';
import { BudgetSection } from './settings/BudgetSection';
import { AppDataSection } from './settings/AppDataSection';

export const SettingsScreen: React.FC = () => (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
