/**
 * Expense & Shared Shopping List Mobile App (Bare React Native)
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
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

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AppProviders>
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
});

export default App;
