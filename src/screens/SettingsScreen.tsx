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
import { Header, Card, Button, CustomModal } from '../components/common';
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
    addUser,
    deleteUser,
    formatAmount,
  } = useUser();
  const { budget, setTotalBudget, resetExpensesToDefault } = useExpense();
  const { resetShoppingListsToDefault } = useShoppingList();

  const [budgetInput, setBudgetInput] = useState(
    budget.totalLimit > 0 ? String(budget.totalLimit) : ''
  );
  const [budgetSavedBanner, setBudgetSavedBanner] = useState(false);

  // Add Household Member modal state
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addMemberError, setAddMemberError] = useState('');

  // Delete Household Member modal state
  const [deleteUserModalVisible, setDeleteUserModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);

  const handleOpenDeleteModal = (user: UserProfile) => {
    setUserToDelete(user);
    setDeleteUserModalVisible(true);
  };

  const handleConfirmDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setDeleteUserModalVisible(false);
      setUserToDelete(null);
    }
  };

  const currencyOptions: CurrencyCode[] = ['EUR', 'USD', 'GBP'];

  const handleSaveBudget = () => {
    const parsed = parseCurrencyInput(budgetInput);
    if (parsed > 0) {
      setTotalBudget(parsed);
      setBudgetSavedBanner(true);
      setTimeout(() => setBudgetSavedBanner(false), 3000);
    }
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      setAddMemberError('Please enter a name for the member.');
      return;
    }

    addUser(newMemberName.trim(), newMemberEmail.trim() || undefined);
    setNewMemberName('');
    setNewMemberEmail('');
    setAddMemberError('');
    setAddMemberModalVisible(false);
  };

  const handleResetData = () => {
    resetExpensesToDefault();
    resetShoppingListsToDefault();
    setCurrency('EUR');
    setActiveUser('u1');
    setBudgetInput('');
    Alert.alert(
      'Data Cleared',
      'All expenses and shopping lists have been cleared.'
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
                <View
                  key={user.id}
                  style={[
                    styles.userRow,
                    isActive && styles.userRowActive,
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setActiveUser(user.id)}
                    style={styles.userMainTouchable}
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

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleOpenDeleteModal(user)}
                    style={styles.deleteUserButton}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityLabel={`Delete ${user.name}`}
                  >
                    <Text style={styles.deleteUserIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setAddMemberError('');
              setAddMemberModalVisible(true);
            }}
            style={styles.addMemberBtn}
          >
            <Text style={styles.addMemberBtnText}>＋ Add Household Member</Text>
          </TouchableOpacity>
        </Card>

        {/* Monthly Budget Setting */}
        <Text style={styles.sectionTitle}>Monthly Budget Limit</Text>
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionDescription}>
            Current limit: {budget.totalLimit > 0 ? formatAmount(budget.totalLimit) : 'Not set'}
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
              placeholder="0.00"
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
            title="Clear All Data"
            variant="outline"
            onPress={handleResetData}
            style={styles.resetBtn}
            textStyle={{ color: THEME.colors.danger }}
          />
        </Card>
      </ScrollView>

      {/* Add Member Modal */}
      <CustomModal
        visible={addMemberModalVisible}
        onClose={() => {
          setAddMemberModalVisible(false);
          setNewMemberName('');
          setNewMemberEmail('');
          setAddMemberError('');
        }}
        title="Add Household Member"
        subtitle="Add a flatmate or family member to collaborate on shopping lists"
      >
        <View style={styles.modalContent}>
          {addMemberError ? (
            <Text style={styles.modalErrorBanner}>{addMemberError}</Text>
          ) : null}

          <Text style={styles.modalInputLabel}>Name / Nickname</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g. Maria, Luca"
            placeholderTextColor={THEME.colors.textMuted}
            value={newMemberName}
            onChangeText={t => {
              setNewMemberName(t);
              setAddMemberError('');
            }}
          />

          <Text style={[styles.modalInputLabel, { marginTop: THEME.spacing.md }]}>
            Email Address (Optional)
          </Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g. member@example.com"
            placeholderTextColor={THEME.colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={newMemberEmail}
            onChangeText={setNewMemberEmail}
          />

          <View style={styles.modalActions}>
            <Button
              title="Add Member"
              onPress={handleAddMember}
              size="lg"
              style={styles.modalSubmitBtn}
            />
          </View>
        </View>
      </CustomModal>

      {/* Delete Household Member Confirmation Modal */}
      <CustomModal
        visible={deleteUserModalVisible}
        onClose={() => {
          setDeleteUserModalVisible(false);
          setUserToDelete(null);
        }}
        title="Delete Household Member"
        subtitle="Confirm member removal"
      >
        {userToDelete ? (
          <View style={styles.modalContent}>
            {householdUsers.length <= 1 ? (
              <View>
                <View style={styles.deleteWarningBox}>
                  <Text style={styles.deleteWarningIcon}>⚠️</Text>
                  <View style={styles.deleteWarningTextWrapper}>
                    <Text style={styles.deleteWarningTitle}>Cannot Delete Member</Text>
                    <Text style={styles.deleteWarningText}>
                      "{userToDelete.name}" is the only household member. At least one member is required to manage personal finances.
                    </Text>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <Button
                    title="Understood"
                    variant="secondary"
                    onPress={() => {
                      setDeleteUserModalVisible(false);
                      setUserToDelete(null);
                    }}
                    size="lg"
                    style={styles.modalSubmitBtn}
                  />
                </View>
              </View>
            ) : (
              <View>
                <View style={styles.deleteUserCard}>
                  <View
                    style={[
                      styles.userAvatar,
                      styles.deleteAvatarLarge,
                      { backgroundColor: userToDelete.avatarColor },
                    ]}
                  >
                    <Text style={[styles.userInitials, styles.deleteInitialsLarge]}>
                      {userToDelete.initials}
                    </Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.deleteUserName}>{userToDelete.name}</Text>
                    <Text style={styles.userEmail}>{userToDelete.email}</Text>
                  </View>
                </View>

                <Text style={styles.deletePromptText}>
                  Are you sure you want to delete{' '}
                  <Text style={styles.deletePromptBold}>{userToDelete.name}</Text> from your household?
                </Text>

                {userToDelete.id === activeUser.id ? (
                  <View style={styles.activeUserNoticeBox}>
                    <Text style={styles.activeUserNoticeText}>
                      ℹ️ This member is currently active. Deleting it will automatically switch the active profile to another household member.
                    </Text>
                  </View>
                ) : null}

                <View style={styles.deleteActionsRow}>
                  <Button
                    title="Cancel"
                    variant="outline"
                    onPress={() => {
                      setDeleteUserModalVisible(false);
                      setUserToDelete(null);
                    }}
                    size="md"
                    style={styles.cancelDeleteBtn}
                  />
                  <Button
                    title="Delete Member"
                    variant="danger"
                    onPress={handleConfirmDeleteUser}
                    size="md"
                    style={styles.confirmDeleteBtn}
                  />
                </View>
              </View>
            )}
          </View>
        ) : null}
      </CustomModal>
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
  addMemberBtn: {
    marginTop: THEME.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  addMemberBtnText: {
    ...THEME.typography.bodyBold,
    color: THEME.colors.primary,
    fontSize: 14,
  },
  modalContent: {
    paddingBottom: THEME.spacing.md,
  },
  modalErrorBanner: {
    backgroundColor: THEME.colors.dangerLight,
    color: THEME.colors.danger,
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: THEME.spacing.md,
    fontSize: 13,
    fontWeight: '500',
  },
  modalInputLabel: {
    ...THEME.typography.captionBold,
    color: THEME.colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  modalInput: {
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: THEME.colors.textPrimary,
  },
  modalActions: {
    marginTop: THEME.spacing.xl,
  },
  modalSubmitBtn: {
    width: '100%',
  },
  userMainTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteUserButton: {
    padding: 8,
    marginLeft: 6,
    borderRadius: THEME.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  deleteUserIcon: {
    fontSize: 15,
  },
  deleteAvatarLarge: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  deleteInitialsLarge: {
    fontSize: 16,
  },
  deleteUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceSubtle,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginBottom: 14,
  },
  deleteUserName: {
    ...THEME.typography.bodyBold,
    fontSize: 15,
    color: THEME.colors.textPrimary,
  },
  deletePromptText: {
    ...THEME.typography.body,
    color: THEME.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  deletePromptBold: {
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  activeUserNoticeBox: {
    backgroundColor: THEME.colors.warningLight,
    padding: 10,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: 12,
  },
  activeUserNoticeText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 16,
    fontWeight: '500',
  },
  deleteWarningBox: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.dangerLight,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    marginBottom: 16,
    gap: 10,
    alignItems: 'flex-start',
  },
  deleteWarningIcon: {
    fontSize: 20,
  },
  deleteWarningTextWrapper: {
    flex: 1,
  },
  deleteWarningTitle: {
    ...THEME.typography.bodyBold,
    color: THEME.colors.danger,
    marginBottom: 2,
  },
  deleteWarningText: {
    ...THEME.typography.caption,
    color: THEME.colors.danger,
    lineHeight: 16,
  },
  deleteActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: THEME.spacing.lg,
  },
  cancelDeleteBtn: {
    flex: 1,
  },
  confirmDeleteBtn: {
    flex: 1,
  },
});
