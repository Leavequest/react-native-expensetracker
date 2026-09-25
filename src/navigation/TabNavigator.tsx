import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ExpensesScreen, AnalyticsScreen, SettingsScreen } from '../screens';
import { THEME } from '../constants';
import { Icon, IconName } from '../components/common';
import { ShoppingStack } from './ShoppingStack';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

interface TabIconProps {
  name: IconName;
  focused: boolean;
  color: string;
}

const TabIcon: React.FC<TabIconProps> = ({ name, focused, color }) => (
  <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
    <Icon name={name} size={20} color={color} strokeWidth={focused ? 2.4 : 2} />
  </View>
);

/** Builds a stable `tabBarIcon` renderer for a tab. */
const tabIcon =
  (name: IconName) =>
  ({ focused, color }: { focused: boolean; color: string }) =>
    <TabIcon name={name} focused={focused} color={color} />;

export const TabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarButtonTestID: `tab-${route.name}`,
      tabBarActiveTintColor: THEME.colors.primaryDark,
      tabBarInactiveTintColor: THEME.colors.textMuted,
      tabBarLabelStyle: styles.tabLabel,
      tabBarStyle: styles.tabBar,
    })}
  >
    <Tab.Screen
      name="Expenses"
      component={ExpensesScreen}
      options={{ tabBarIcon: tabIcon('wallet') }}
    />
    <Tab.Screen
      name="Shopping"
      component={ShoppingStack}
      options={{ tabBarIcon: tabIcon('cart') }}
    />
    <Tab.Screen
      name="Analytics"
      component={AnalyticsScreen}
      options={{ tabBarIcon: tabIcon('chart') }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ tabBarIcon: tabIcon('settings') }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceBorder,
    paddingTop: 6,
    ...THEME.shadows.card,
  },
  iconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.full,
  },
  iconContainerActive: {
    backgroundColor: THEME.colors.primaryLight,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
