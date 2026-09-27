import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Icon } from '../../components/common';
import { THEME } from '../../constants';
import { useUser } from '../../context';
import { UserProfile } from '../../types';
import { SettingsSection } from './SettingsSection';
import { AddMemberModal } from './AddMemberModal';
import { DeleteMemberModal } from '../../components/account/DeleteMemberModal';

export const HouseholdSection: React.FC = () => {
  const { activeUser, householdUsers, setActiveUser } = useUser();

  const [addMemberVisible, setAddMemberVisible] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<UserProfile | null>(null);

  return (
    <SettingsSection
      title="Active Household User"
      description="Switch active profile to simulate collaborative shopping and expense assignment between flatmates or family members."
    >
      <View style={styles.usersList}>
        {householdUsers.map(user => {
          const isActive = activeUser.id === user.id;

          return (
            <View key={user.id} style={[styles.userRow, isActive && styles.userRowActive]}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveUser(user.id)}
                style={styles.userMainTouchable}
              >
                <Avatar user={user} size={36} style={styles.userAvatar} />

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
                onPress={() => setMemberToDelete(user)}
                style={styles.deleteUserButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel={`Delete ${user.name}`}
              >
                <Icon name="close" size={16} color={THEME.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setAddMemberVisible(true)}
        style={styles.addMemberBtn}
      >
        <Icon name="plus" size={16} color={THEME.colors.primary} strokeWidth={2.5} />
        <Text style={styles.addMemberBtnText}>Add Household Member</Text>
      </TouchableOpacity>

      <AddMemberModal visible={addMemberVisible} onClose={() => setAddMemberVisible(false)} />
      <DeleteMemberModal member={memberToDelete} onClose={() => setMemberToDelete(null)} />
    </SettingsSection>
  );
};

const styles = StyleSheet.create({
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
  userMainTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    marginRight: 10,
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
    color: THEME.colors.textInverse,
    fontSize: 11,
    fontWeight: '700',
  },
  switchText: {
    ...THEME.typography.captionBold,
    color: THEME.colors.primary,
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
  addMemberBtn: {
    marginTop: THEME.spacing.md,
    flexDirection: 'row',
    gap: 6,
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
});
