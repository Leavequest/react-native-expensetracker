import React from 'react';
import { View, ScrollView } from 'react-native';
import { Header } from '../components/common';
import { PreferencesSection } from './settings/PreferencesSection';
import { HouseholdSection } from './settings/HouseholdSection';
import { AppDataSection } from './settings/AppDataSection';
import { makeStyles } from '../context';

export const SettingsScreen: React.FC = () => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Header title="Settings" subtitle="Preferences, household & data" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <PreferencesSection />
        <HouseholdSection />
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
