import React from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
import { Avatar, CustomModal, Button } from '../common';
import { ShoppingList } from '../../types';
import { THEME } from '../../constants';
import { useUser, makeStyles } from '../../context';

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
  const styles = useStyles();
  const { householdUsers } = useUser();

  if (!list) return null;

  const handleShareCode = () => {
    Share.share({
      message: `Join my "${list.name}" shopping list with the code: ${list.shareCode}`,
    }).catch(() => {
      // Share sheet dismissed or unavailable; nothing to do
    });
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
            onPress={handleShareCode}
            style={styles.shareBtn}
          >
            <Text style={styles.shareBtnText}>Share Code</Text>
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
              <Avatar user={user} size={32} style={styles.userAvatar} />
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

const useStyles = makeStyles(colors => ({
  content: {
    paddingBottom: THEME.spacing.md,
  },
  label: {
    ...THEME.typography.captionBold,
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.md,
  },
  codeText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2,
    color: colors.primaryDark,
  },
  shareBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.md,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  hintText: {
    ...THEME.typography.caption,
    color: colors.textMuted,
    marginTop: 8,
    lineHeight: 18,
  },
  collaboratorsList: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
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
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...THEME.typography.bodyBold,
    color: colors.textPrimary,
  },
  userEmail: {
    ...THEME.typography.caption,
    color: colors.textMuted,
  },
  youBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.full,
  },
  youText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '700',
  },
  actions: {
    marginTop: THEME.spacing.xl,
  },
  doneBtn: {
    width: '100%',
  },
}));
