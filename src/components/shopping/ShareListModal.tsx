import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CustomModal, Button } from '../common';
import { ShoppingList } from '../../types';
import { THEME } from '../../constants';
import { useUser } from '../../context';

interface ShareListModalProps {
  visible: boolean;
  onClose: () => void;
  list: ShoppingList | null;
}

export const ShareListModal: React.FC<ShareListModalProps> = ({
  visible,
  onClose,
  list,
}) => {
  const { householdUsers } = useUser();
  const [copied, setCopied] = useState(false);

  if (!list) return null;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  const collaborators = householdUsers.filter(u =>
    list.collaboratorIds.includes(u.id)
  );

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      title="Share Shopping List"
      subtitle={`Collaborate in real-time on ${list.name}`}
    >
      <View style={styles.content}>
        {/* Code Box */}
        <Text style={styles.label}>Unique Share Code</Text>
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>{list.shareCode}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCopy}
            style={[styles.copyBtn, copied && styles.copyBtnSuccess]}
          >
            <Text style={[styles.copyBtnText, copied && styles.copyBtnTextSuccess]}>
              {copied ? 'Copied! ✓' : 'Copy Code'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hintText}>
          Give this code to roommates or family members. They can enter it in the
          "Join List" option to edit items with you in real-time.
        </Text>

        {/* Collaborators List */}
        <Text style={[styles.label, { marginTop: THEME.spacing.lg }]}>
          Current Collaborators ({collaborators.length})
        </Text>
        <View style={styles.collaboratorsList}>
          {collaborators.map(user => (
            <View key={user.id} style={styles.userRow}>
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
              {user.isCurrentUser ? (
                <View style={styles.youBadge}>
                  <Text style={styles.youText}>You</Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button
            title="Done"
            variant="secondary"
            onPress={onClose}
            size="lg"
            style={styles.doneBtn}
          />
        </View>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: THEME.spacing.md,
  },
  label: {
    ...THEME.typography.captionBold,
    color: THEME.colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.md,
  },
  codeText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME.colors.primaryDark,
  },
  copyBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.md,
  },
  copyBtnSuccess: {
    backgroundColor: THEME.colors.successLight,
    borderWidth: 1,
    borderColor: THEME.colors.success,
  },
  copyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  copyBtnTextSuccess: {
    color: THEME.colors.success,
  },
  hintText: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    marginTop: 8,
    lineHeight: 18,
  },
  collaboratorsList: {
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    padding: THEME.spacing.sm,
    gap: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  userInitials: {
    color: '#FFFFFF',
    fontSize: 12,
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
  youBadge: {
    backgroundColor: THEME.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.full,
  },
  youText: {
    color: THEME.colors.primaryDark,
    fontSize: 11,
    fontWeight: '700',
  },
  actions: {
    marginTop: THEME.spacing.xl,
  },
  doneBtn: {
    width: '100%',
  },
});
