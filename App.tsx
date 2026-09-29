/**
 * Expense & Shared Shopping List Mobile App (Bare React Native)
 *
 * @format
 */

import React, { useMemo } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  Theme,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Toaster } from 'sonner-native';
import { AppProviders, makeStyles, useTheme } from './src/context';
import { AccountSheetProvider } from './src/components/account';
import { RootTabParamList } from './src/navigation/types';
import { TabNavigator } from './src/navigation/TabNavigator';

const navigationRef = createNavigationContainerRef<RootTabParamList>();

// Used by the account sheet's "Manage household" row
function openSettings() {
  if (navigationRef.isReady()) navigationRef.navigate('Settings');
}

function LoadingScreen() {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

/** Everything that depends on the current theme, so it has to live inside ThemeProvider. */
function ThemedApp() {
  const { colors, isDark, mode } = useTheme();

  const navigationTheme = useMemo<Theme>(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.surfaceBorder,
        notification: colors.danger,
      },
    };
  }, [colors, isDark]);

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        <BottomSheetModalProvider>
          <AccountSheetProvider onManageHousehold={openSettings}>
            <TabNavigator />
          </AccountSheetProvider>
        </BottomSheetModalProvider>
      </NavigationContainer>
      <Toaster position="bottom-center" offset={80} theme={mode} />
    </>
  );
}

function App(): React.JSX.Element {
  const styles = useStyles();
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AppProviders fallback={<LoadingScreen />}>
          <ThemedApp />
        </AppProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const useStyles = makeStyles(colors => ({
  root: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
}));

export default App;
