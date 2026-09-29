import React, { ReactNode, useMemo, useState } from 'react';
import { UserProfile } from '../../types';
import { AccountSheet } from './AccountSheet';
import { AccountSheetContext } from './accountSheetContext';
import { ProfileSheet } from './ProfileSheet';

interface AccountSheetProviderProps {
  children: ReactNode;
  /** Opens the Settings tab; called after the account sheet has closed */
  onManageHousehold: () => void;
}

/** Owns the one account sheet (and its profile sheet) that every screen header opens. */
export const AccountSheetProvider: React.FC<AccountSheetProviderProps> = ({
  children,
  onManageHousehold,
}) => {
  const [visible, setVisible] = useState(false);
  const [profileMember, setProfileMember] = useState<UserProfile | null>(null);

  const value = useMemo(
    () => ({ openAccountSheet: () => setVisible(true), openProfile: setProfileMember }),
    []
  );

  const handleEditProfile = (member: UserProfile) => {
    setVisible(false);
    setProfileMember(member);
  };

  return (
    <AccountSheetContext.Provider value={value}>
      {children}
      <AccountSheet
        visible={visible}
        onClose={() => setVisible(false)}
        onEditProfile={handleEditProfile}
        onManageHousehold={onManageHousehold}
      />
      <ProfileSheet member={profileMember} onClose={() => setProfileMember(null)} />
    </AccountSheetContext.Provider>
  );
};
