/**
 * Expense & Shared Shopping List Mobile App (Bare React Native)
 *
 * @format
 */

import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { AppProviders } from './src/context';
import { TabNavigator } from './src/navigation/TabNavigator';
import { THEME } from './src/constants';

function AppContent() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.rootContainer, { paddingTop: insets.top }]}>
      <TabNavigator />
    </View>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={THEME.colors.primary} />
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AppProviders fallback={<LoadingScreen />}>
        <AppContent />
      </AppProviders>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.background,
  },
});

export default App;
