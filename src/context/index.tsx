import React, { ReactNode, useEffect, useState } from 'react';
import { UserProvider } from './UserContext';
import { ExpenseProvider } from './ExpenseContext';
import { ShoppingListProvider } from './ShoppingListContext';
import { loadAppState, PersistedAppState } from '../storage/persistence';

export * from './UserContext';
export * from './ExpenseContext';
export * from './ShoppingListContext';
export * from './useRemoveHouseholdMember';

interface AppProvidersProps {
  children: ReactNode;
  /** Rendered while saved data is being loaded from the device */
  fallback?: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children, fallback = null }) => {
  const [savedState, setSavedState] = useState<PersistedAppState | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadAppState().then(state => {
      if (!cancelled) setSavedState(state);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Providers read their initial state once, so wait until loading finishes
  if (!savedState) return <>{fallback}</>;

  return (
    <UserProvider initialState={savedState.user}>
      <ExpenseProvider initialState={savedState.expenses}>
        <ShoppingListProvider initialState={savedState.shopping}>
          {children}
        </ShoppingListProvider>
      </ExpenseProvider>
    </UserProvider>
  );
};
