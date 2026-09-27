import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  Avatar,
  Button,
  CustomModal,
  ErrorBanner,
  FormInput,
  FormLabel,
  Icon,
  SettingsRow,
  showSuccessToast,
} from '../common';
import { THEME } from '../../constants';
import { OWNER_ONLY_CAPTION, usePermission, useUser } from '../../context';
import { DeleteMemberModal } from './DeleteMemberModal';
import { UserProfile } from '../../types';
import { AVATAR_COLORS, getInitials, isOwner } from '../../utils';
import { MemberTags } from './MemberTags';

interface ProfileSheetProps {
  /** Member being edited; the sheet is visible while this is set */
  member: UserProfile | null;
  onClose: () => void;
}

export const ProfileSheet: React.FC<ProfileSheetProps> = ({ member, onClose }) => {
  const { activeUser, updateUser } = useUser();
  const canEditOthers = usePermission('editOtherProfile').allowed;
  const canRemove = usePermission('removeMember').allowed;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarColor, setAvatarColor] = useState('');
  const [error, setError] = useState('');
  const [memberToDelete, setMemberToDelete] = useState<UserProfile | null>(null);

  // Start from the member's saved values every time the sheet opens
  useEffect(() => {
    if (member) {
      setName(member.name);
      setEmail(member.email);
      setAvatarColor(member.avatarColor);
      setError('');
    }
  }, [member]);

  const isSelf = member?.id === activeUser.id;
  const editable = isSelf || canEditOthers;

  const handleSave = () => {
    if (!member) return;
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Name is required');
      return;
    }
    updateUser(member.id, {
      name: trimmedName,
      initials: getInitials(trimmedName),
      email: email.trim(),
      avatarColor,
    });
    showSuccessToast('Profile saved');
    onClose();
  };

  // The confirmation is its own sheet, so close this one first
  const handleRemove = () => {
    if (!member) return;
    setMemberToDelete(member);
    onClose();
  };

  const ownerCantBeRemoved = member ? isOwner(member) : false;

  return (
    <>
      <CustomModal
        visible={member !== null}
        onClose={onClose}
        title={isSelf ? 'Edit profile' : 'Household member'}
      >
        {member ? (
          <View style={styles.content}>
            <View style={styles.preview}>
              <Avatar
                user={{ initials: getInitials(name || member.name), avatarColor }}
                size={56}
              />
              <MemberTags member={member} />
            </View>

            <ErrorBanner message={error} />

            <FormLabel style={styles.label}>Name</FormLabel>
            <FormInput
              accessibilityLabel="Name"
              value={name}
              editable={editable}
              onChangeText={text => {
                setName(text);
                setError('');
              }}
            />

            <FormLabel style={styles.label}>Email (optional)</FormLabel>
            <FormInput
              accessibilityLabel="Email"
              value={email}
              editable={editable}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
            />

            <FormLabel style={styles.label}>Avatar colour</FormLabel>
            <View style={styles.swatches} accessibilityRole="radiogroup">
              {AVATAR_COLORS.map(({ color, name: colorName }) => {
                const selected = color === avatarColor;
                return (
                  <TouchableOpacity
                    key={color}
                    activeOpacity={0.7}
                    onPress={() => setAvatarColor(color)}
                    disabled={!editable}
                    accessibilityRole="radio"
                    accessibilityLabel={`Avatar colour, ${colorName.toLowerCase()}`}
                    accessibilityState={{ selected, disabled: !editable }}
                    style={[styles.swatch, { backgroundColor: color }, selected && styles.swatchSelected]}
                  >
                    {selected ? (
                      <Icon name="check" size={16} color={THEME.colors.textInverse} strokeWidth={3} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>

            <Button
              title="Save"
              onPress={handleSave}
              size="lg"
              disabled={!editable}
              style={styles.saveButton}
            />
            {!editable ? <Text style={styles.caption}>{OWNER_ONLY_CAPTION}</Text> : null}

            {!isSelf ? (
              <View style={styles.removeRow}>
                <SettingsRow
                  label="Remove member"
                  destructive
                  accessory="none"
                  disabled={ownerCantBeRemoved || !canRemove}
                  disabledCaption={
                    ownerCantBeRemoved ? "The household owner can't be removed." : OWNER_ONLY_CAPTION
                  }
                  onPress={handleRemove}
                />
              </View>
            ) : null}
          </View>
        ) : null}
      </CustomModal>

      <DeleteMemberModal member={memberToDelete} onClose={() => setMemberToDelete(null)} />
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: THEME.spacing.md,
  },
  preview: {
    alignItems: 'center',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  label: {
    textTransform: 'none',
    marginTop: THEME.spacing.md,
  },
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.md,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: THEME.colors.textPrimary,
  },
  saveButton: {
    width: '100%',
    marginTop: THEME.spacing.xl,
  },
  caption: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: THEME.spacing.sm,
  },
  removeRow: {
    marginTop: THEME.spacing.lg,
    marginHorizontal: -THEME.spacing.lg,
  },
});
