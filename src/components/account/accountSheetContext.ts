import { createContext, useContext } from 'react';
import type { UserProfile } from '../../types';

interface AccountSheetContextValue {
  openAccountSheet: () => void;
  /** Opens the profile sheet for any household member (e.g. from Settings) */
  openProfile: (member: UserProfile) => void;
}

// Kept apart from the provider so Header can use it without importing the sheets (avoids an import cycle)
export const AccountSheetContext = createContext<AccountSheetContextValue | undefined>(undefined);

export function useAccountSheet(): AccountSheetContextValue {
  const context = useContext(AccountSheetContext);
  if (!context) {
    throw new Error('useAccountSheet must be used within an AccountSheetProvider');
  }
  return context;
}
