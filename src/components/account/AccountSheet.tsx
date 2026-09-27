import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Avatar,
  CustomModal,
  Icon,
  SettingsGroup,
  SettingsRow,
  showSuccessToast,
} from '../common';
import { THEME } from '../../constants';
import { useUser } from '../../context';
import { UserProfile } from '../../types';
import { isPending } from '../../utils';
import { MemberTags } from './MemberTags';

interface AccountSheetProps {
  visible: boolean;
  onClose: () => void;
  onEditProfile: (member: UserProfile) => void;
  /** Called once the sheet has fully closed after "Manage household" */
  onManageHousehold: () => void;
}

export const AccountSheet: React.FC<AccountSheetProps> = ({
  visible,
  onClose,
  onEditProfile,
  onManageHousehold,
}) => {
  const { activeUser, householdUsers, setActiveUser } = useUser();
  // Work to run after the close animation, so nothing navigates under an open sheet
  const afterDismiss = useRef<(() => void) | null>(null);

  const otherMembers = householdUsers.filter(u => u.id !== activeUser.id);

  const handleSwitch = (member: UserProfile) => {
    setActiveUser(member.id);
    onClose();
    showSuccessToast(`Switched to ${member.name}`);
  };

  const handleManageHousehold = () => {
    afterDismiss.current = onManageHousehold;
    onClose();
  };

  const handleDismissed = () => {
    const next = afterDismiss.current;
    afterDismiss.current = null;
    next?.();
  };

  return (
    <CustomModal visible={visible} onClose={onClose} onDismissed={handleDismissed} title="Account">
      <View style={styles.profile}>
        <Avatar user={activeUser} size={64} />
        <Text style={styles.name}>{activeUser.name}</Text>
        {activeUser.email ? <Text style={styles.email}>{activeUser.email}</Text> : null}
        <MemberTags member={activeUser} />
      </View>

      {otherMembers.length > 0 ? (
        <SettingsGroup title="Switch to" style={styles.group}>
          {otherMembers.map(member => (
            <SettingsRow
              key={member.id}
              label={member.name}
              left={<Avatar user={member} size={32} />}
              tags={<MemberTags member={member} />}
              accessory="none"
              disabled={isPending(member)}
              onPress={() => handleSwitch(member)}
              accessibilityLabel={`Switch to ${member.name}`}
            />
          ))}
        </SettingsGroup>
      ) : null}

      <SettingsGroup style={styles.group}>
        <SettingsRow
          label="Edit profile"
          left={<Icon name="user" size={18} color={THEME.colors.textSecondary} />}
          onPress={() => onEditProfile(activeUser)}
        />
        <SettingsRow
          label="Manage household"
          left={<Icon name="users" size={18} color={THEME.colors.textSecondary} />}
          onPress={handleManageHousehold}
        />
      </SettingsGroup>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  profile: {
    alignItems: 'center',
    gap: THEME.spacing.xs,
  },
  name: {
    ...THEME.typography.titleSmall,
    color: THEME.colors.textPrimary,
    marginTop: THEME.spacing.sm,
  },
  email: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
  },
  group: {
    marginHorizontal: 0,
  },
});
