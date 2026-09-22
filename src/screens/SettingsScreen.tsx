import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Header, Card, Button } from '../components/common';
import { CURRENCIES, THEME } from '../constants';
import { useUser, useExpense, useShoppingList } from '../context';
import { CurrencyCode } from '../types';
import { parseCurrencyInput } from '../utils';

export const SettingsScreen: React.FC = () => {
  const {
    activeUser,
    householdUsers,
    currency,
    setCurrency,
    setActiveUser,
    formatAmount,
  } = useUser();
  const { budget, setTotalBudget, resetExpensesToDefault } = useExpense();
  const { resetShoppingListsToDefault } = useShoppingList();

  const [budgetInput, setBudgetInput] = useState(String(budget.totalLimit));
  const [budgetSavedBanner, setBudgetSavedBanner] = useState(false);

  const currencyOptions: CurrencyCode[] = ['EUR', 'USD', 'GBP'];

  const handleSaveBudget = () => {
    const parsed = parseCurrencyInput(budgetInput);
    if (parsed > 0) {
      setTotalBudget(parsed);
      setBudgetSavedBanner(true);
      setTimeout(() => setBudgetSavedBanner(false), 3000);
    }
  };

  const handleResetData = () => {
    resetExpensesToDefault();
    resetShoppingListsToDefault();
    setCurrency('EUR');
    setActiveUser('u1');
    setBudgetInput('2400');
    Alert.alert(
      'Data Reset',
      'All expenses, shopping lists, and settings have been restored to initial defaults.'
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Settings"
        subtitle="Currency, household & preferences"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Currency Switcher Section */}
        <Text style={styles.sectionTitle}>Active Currency</Text>
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionDescription}>
            Select the currency used across all balances, budgets, price tags, and
            shopping list estimates. Default is set to Euro (€) for the European market.
          </Text>

          <View style={styles.currencyCardsRow}>
            {currencyOptions.map(code => {
              const config = CURRENCIES[code];
              const isSelected = currency === code;

              return (
                <TouchableOpacity
                  key={code}
                  activeOpacity={0.7}
                  onPress={() => setCurrency(code)}
                  style={[
                    styles.currencyOptionCard,
                    isSelected && styles.currencyOptionCardActive,
                  ]}
                >
                  <View
                    style={[
                      styles.currencySymbolCircle,
                      isSelected && styles.currencySymbolCircleActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.currencySymbolText,
                        isSelected && styles.currencySymbolTextActive,
                      ]}
                    >
                      {config.symbol}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.currencyCodeText,
                      isSelected && styles.currencyCodeTextActive,
                    ]}
                  >
                    {config.code}
                  </Text>
                  <Text style={styles.currencyNameText}>{config.label}</Text>
                  {isSelected ? (
                    <View style={styles.activeCheckBadge}>
                      <Text style={styles.activeCheckText}>Active ✓</Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Household Member Switcher */}
        <Text style={styles.sectionTitle}>Active Household User</Text>
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionDescription}>
            Switch active profile to simulate collaborative shopping and expense
            assignment between flatmates or family members.
          </Text>

          <View style={styles.usersList}>
            {householdUsers.map(user => {
              const isActive = activeUser.id === user.id;

              return (
                <TouchableOpacity
                  key={user.id}
                  activeOpacity={0.7}
                  onPress={() => setActiveUser(user.id)}
                  style={[
                    styles.userRow,
                    isActive && styles.userRowActive,
                  ]}
                >
                  <View
                    style={[
                      styles.userAvatar,
                      { backgroundColor: user.avatarColor },
                    ]}
                  >
                    <Text style={styles.userInitials}>{user.initials}</Text>
                  </View>

                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>

                  {isActive ? (
                    <View style={styles.currentUserBadge}>
                      <Text style={styles.currentUserText}>Current</Text>
                    </View>
                  ) : (
                    <Text style={styles.switchText}>Switch</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Monthly Budget Setting */}
        <Text style={styles.sectionTitle}>Monthly Budget Limit</Text>
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionDescription}>
            Current limit: {formatAmount(budget.totalLimit)}
          </Text>

          {budgetSavedBanner ? (
            <View style={styles.savedBanner}>
              <Text style={styles.savedBannerText}>Budget updated successfully! ✓</Text>
            </View>
          ) : null}

          <View style={styles.budgetInputRow}>
            <TextInput
              style={styles.budgetInput}
              value={budgetInput}
              onChangeText={setBudgetInput}
              keyboardType="decimal-pad"
              placeholder="2400"
              placeholderTextColor={THEME.colors.textMuted}
            />
            <Button
              title="Save Limit"
              onPress={handleSaveBudget}
              size="md"
              style={styles.saveBudgetBtn}
            />
          </View>
        </Card>

        {/* Data & App Info */}
        <Text style={styles.sectionTitle}>App & Data</Text>
        <Card style={styles.sectionCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Architecture</Text>
            <Text style={styles.infoValue}>React Native</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>React Version</Text>
            <Text style={styles.infoValue}>19.2.3</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>React Native</Text>
            <Text style={styles.infoValue}>0.87.1</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Market Region</Text>
            <Text style={styles.infoValue}>Europe (EUR € default)</Text>
          </View>

          <Button
            title="Reset All Sample Data"
            variant="outline"
            onPress={handleResetData}
            style={styles.resetBtn}
            textStyle={{ color: THEME.colors.danger }}
          />
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    ...THEME.typography.titleSmall,
    color: THEME.colors.textPrimary,
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.xs,
  },
  sectionCard: {
    marginHorizontal: THEME.spacing.lg,
    backgroundColor: THEME.colors.surface,
  },
  sectionDescription: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
    lineHeight: 18,
  },
  currencyCardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  currencyOptionCard: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceBorder,
    padding: THEME.spacing.md,
    alignItems: 'center',
  },
  currencyOptionCardActive: {
    backgroundColor: THEME.colors.primaryLight,
    borderColor: THEME.colors.primary,
  },
  currencySymbolCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  currencySymbolCircleActive: {
    backgroundColor: THEME.colors.primary,
  },
  currencySymbolText: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  currencySymbolTextActive: {
    color: '#FFFFFF',
  },
  currencyCodeText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  currencyCodeTextActive: {
    color: THEME.colors.primaryDark,
  },
  currencyNameText: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  activeCheckBadge: {
    marginTop: 6,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.full,
  },
  activeCheckText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  usersList: {
    gap: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  userRowActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  userInitials: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...THEME.typography.bodyBold,
    color: THEME.colors.textPrimary,
  },
  userEmail: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
  },
  currentUserBadge: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.full,
  },
  currentUserText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  switchText: {
    ...THEME.typography.captionBold,
    color: THEME.colors.primary,
  },
  savedBanner: {
    backgroundColor: THEME.colors.successLight,
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: THEME.spacing.sm,
  },
  savedBannerText: {
    color: THEME.colors.primaryDark,
    fontSize: 12,
    fontWeight: '600',
  },
  budgetInputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  budgetInput: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  saveBudgetBtn: {
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceBorder,
  },
  infoLabel: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
  },
  infoValue: {
    ...THEME.typography.captionBold,
    color: THEME.colors.textPrimary,
  },
  resetBtn: {
    marginTop: THEME.spacing.lg,
    borderColor: THEME.colors.danger,
  },
});
