import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShoppingListsScreen, ShoppingListDetailScreen } from '../screens';
import { THEME } from '../constants';
import { useTheme } from '../context';
import { ShoppingStackParamList } from './types';

const Stack = createNativeStackNavigator<ShoppingStackParamList>();

export const ShoppingStack: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleStyle: { ...THEME.typography.titleSmall, color: colors.textPrimary },
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: true,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="ShoppingLists"
        component={ShoppingListsScreen}
        options={{ headerShown: false, title: 'Lists' }}
      />
      <Stack.Screen
        name="ShoppingListDetail"
        component={ShoppingListDetailScreen}
        options={{ headerBackTitle: 'Lists' }}
      />
    </Stack.Navigator>
  );
};
