import React, { useState } from 'react';
import { Avatar, Icon, SettingsGroup, SettingsRow } from '../../components/common';
import { MemberTags, useAccountSheet } from '../../components/account';
import { OWNER_ONLY_CAPTION, usePermission, useTheme, useUser } from '../../context';
import { AddMemberModal } from './AddMemberModal';

/** Household members; tapping one opens their profile. Switching lives in the avatar's account sheet. */
export const HouseholdSection: React.FC = () => {
  const { colors } = useTheme();
  const { householdUsers } = useUser();
  const { openProfile } = useAccountSheet();
  const canAddMember = usePermission('addMember').allowed;
  const [addMemberVisible, setAddMemberVisible] = useState(false);

  return (
    <>
      <SettingsGroup
        title="Household"
        caption="Switch between members from your avatar at the top of any screen."
      >
        {householdUsers.map(user => (
          <SettingsRow
            key={user.id}
            label={user.name}
            left={<Avatar user={user} size={32} />}
            tags={<MemberTags member={user} />}
            onPress={() => openProfile(user)}
          />
        ))}
        <SettingsRow
          label="Add member"
          left={<Icon name="plus" size={18} color={colors.primary} strokeWidth={2.5} />}
          onPress={() => setAddMemberVisible(true)}
          disabled={!canAddMember}
          disabledCaption={OWNER_ONLY_CAPTION}
        />
      </SettingsGroup>

      <AddMemberModal visible={addMemberVisible} onClose={() => setAddMemberVisible(false)} />
    </>
  );
};
