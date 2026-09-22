import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ExpensesScreen,
  ShoppingListsScreen,
  AnalyticsScreen,
  SettingsScreen,
} from '../screens';
import { THEME } from '../constants';

export type TabKey = 'expenses' | 'shopping' | 'analytics' | 'settings';

interface TabItem {
  key: TabKey;
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { key: 'expenses', label: 'Expenses', icon: '💳' },
  { key: 'shopping', label: 'Shopping', icon: '🛒' },
  { key: 'analytics', label: 'Analytics', icon: '📊' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
];

export const TabNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('expenses');
  const insets = useSafeAreaInsets();

  const renderScreen = () => {
    switch (activeTab) {
      case 'shopping':
        return <ShoppingListsScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'expenses':
      default:
        return <ExpensesScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Bottom Tab Bar */}
      <View
        style={[
          styles.tabBar,
          {
            paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 8),
          },
        ]}
      >
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tab.key)}
              style={styles.tabButton}
            >
              <View
                style={[
                  styles.iconContainer,
                  isActive && styles.iconContainerActive,
                ]}
              >
                <Text style={styles.tabIcon}>{tab.icon}</Text>
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceBorder,
    paddingTop: 8,
    ...THEME.shadows.card,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.full,
    marginBottom: 2,
  },
  iconContainerActive: {
    backgroundColor: THEME.colors.primaryLight,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    ...THEME.typography.caption,
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textMuted,
  },
  tabLabelActive: {
    color: THEME.colors.primaryDark,
    fontWeight: '700',
  },
});
