import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Button, CustomModal, Icon } from '../common';
import { THEME } from '../../constants';
import { usePermission, useRemoveHouseholdMember, useUser } from '../../context';
import { UserProfile } from '../../types';

interface DeleteMemberModalProps {
  /** Member to delete; the modal is visible while this is set */
  member: UserProfile | null;
  onClose: () => void;
}

export const DeleteMemberModal: React.FC<DeleteMemberModalProps> = ({ member, onClose }) => {
  const { activeUser, householdUsers } = useUser();
  const removeMember = useRemoveHouseholdMember();

  const canRemove = usePermission('removeMember').allowed;

  const handleConfirm = () => {
    if (member && canRemove) removeMember(member.id);
    onClose();
  };

  const isLastMember = householdUsers.length <= 1;

  return (
    <CustomModal
      visible={member !== null}
      onClose={onClose}
      title="Delete Household Member"
      subtitle="Confirm member removal"
    >
      {member ? (
        <View style={styles.content}>
          {isLastMember ? (
            <View>
              <View style={styles.warningBox}>
                <Icon name="warning" size={20} color={THEME.colors.danger} />
                <View style={styles.warningTextWrapper}>
                  <Text style={styles.warningTitle}>Cannot Delete Member</Text>
                  <Text style={styles.warningText}>
                    "{member.name}" is the only household member. At least one member is
                    required to manage personal finances.
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                <Button
                  title="Understood"
                  variant="secondary"
                  onPress={onClose}
                  size="lg"
                  style={styles.fullWidthBtn}
                />
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.memberCard}>
                <Avatar user={member} size={44} style={styles.avatar} />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberEmail}>{member.email}</Text>
                </View>
              </View>

              <Text style={styles.promptText}>
                Are you sure you want to delete{' '}
                <Text style={styles.promptBold}>{member.name}</Text> from your household?
                They will be removed from shared lists and their item assignments cleared.
              </Text>

              {member.id === activeUser.id ? (
                <View style={styles.noticeBox}>
                  <Icon name="info" size={16} color="#92400E" />
                  <Text style={styles.noticeText}>
                    This member is currently active. Deleting it will automatically switch
                    the active profile to another household member.
                  </Text>
                </View>
              ) : null}

              <View style={styles.actionsRow}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={onClose}
                  size="md"
                  style={styles.flexBtn}
                />
                <Button
                  title="Delete Member"
                  variant="danger"
                  onPress={handleConfirm}
                  size="md"
                  style={styles.flexBtn}
                />
              </View>
            </View>
          )}
        </View>
      ) : null}
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: THEME.spacing.md,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceSubtle,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginBottom: 14,
  },
  avatar: {
    marginRight: 10,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...THEME.typography.bodyBold,
    fontSize: 15,
    color: THEME.colors.textPrimary,
  },
  memberEmail: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
  },
  promptText: {
    ...THEME.typography.body,
    color: THEME.colors.textSecondary,
    marginBottom: 12,
  },
  promptBold: {
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  noticeBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: THEME.colors.warningLight,
    padding: 10,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: 12,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 16,
    fontWeight: '500',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.dangerLight,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    marginBottom: 16,
    gap: 10,
    alignItems: 'flex-start',
  },
  warningTextWrapper: {
    flex: 1,
  },
  warningTitle: {
    ...THEME.typography.bodyBold,
    color: THEME.colors.danger,
    marginBottom: 2,
  },
  warningText: {
    ...THEME.typography.caption,
    color: THEME.colors.danger,
    lineHeight: 16,
  },
  actions: {
    marginTop: THEME.spacing.xl,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: THEME.spacing.lg,
  },
  fullWidthBtn: {
    width: '100%',
  },
  flexBtn: {
    flex: 1,
  },
});
