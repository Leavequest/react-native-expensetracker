/**
 * Expense & Shared Shopping List Mobile App (Bare React Native)
 *
 * @format
 */

import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  DefaultTheme,
  NavigationContainer,
  Theme,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Toaster } from 'sonner-native';
import { AppProviders } from './src/context';
import { AccountSheetProvider } from './src/components/account';
import { RootTabParamList } from './src/navigation/types';
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

const navigationRef = createNavigationContainerRef<RootTabParamList>();

// Used by the account sheet's "Manage household" row
function openSettings() {
  if (navigationRef.isReady()) navigationRef.navigate('Settings');
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
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <AppProviders fallback={<LoadingScreen />}>
          <NavigationContainer ref={navigationRef} theme={NAVIGATION_THEME}>
            <BottomSheetModalProvider>
              <AccountSheetProvider onManageHousehold={openSettings}>
                <TabNavigator />
              </AccountSheetProvider>
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
