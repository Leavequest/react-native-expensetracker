import React, { ReactNode } from 'react';
import { UserProvider } from './UserContext';
import { ExpenseProvider } from './ExpenseContext';
import { ShoppingListProvider } from './ShoppingListContext';

export * from './UserContext';
export * from './ExpenseContext';
export * from './ShoppingListContext';

export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <UserProvider>
      <ExpenseProvider>
        <ShoppingListProvider>{children}</ShoppingListProvider>
      </ExpenseProvider>
    </UserProvider>
  );
};
