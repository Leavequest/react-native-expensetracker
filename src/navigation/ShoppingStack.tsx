import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShoppingListsScreen, ShoppingListDetailScreen } from '../screens';
import { THEME } from '../constants';
import { ShoppingStackParamList } from './types';

const Stack = createNativeStackNavigator<ShoppingStackParamList>();

export const ShoppingStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: THEME.colors.primary,
      headerTitleStyle: { ...THEME.typography.titleSmall, color: THEME.colors.textPrimary },
      headerStyle: { backgroundColor: THEME.colors.surface },
      headerShadowVisible: true,
      contentStyle: { backgroundColor: THEME.colors.background },
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
