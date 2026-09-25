/**
 * Expense & Shared Shopping List Mobile App (Bare React Native)
 *
 * @format
 */

import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Toaster } from 'sonner-native';
import { AppProviders } from './src/context';
import { TabNavigator } from './src/navigation/TabNavigator';
import { THEME } from './src/constants';

const NAVIGATION_THEME: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: THEME.colors.primary,
    background: THEME.colors.background,
    card: THEME.colors.surface,
    text: THEME.colors.textPrimary,
    border: THEME.colors.surfaceBorder,
    notification: THEME.colors.danger,
  },
};

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={THEME.colors.primary} />
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <AppProviders fallback={<LoadingScreen />}>
          <NavigationContainer theme={NAVIGATION_THEME}>
            <BottomSheetModalProvider>
              <TabNavigator />
            </BottomSheetModalProvider>
          </NavigationContainer>
        </AppProviders>
        <Toaster position="bottom-center" offset={80} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.background,
  },
});

export default App;
