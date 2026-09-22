import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CurrencyCode, UserProfile } from '../types';
import { DEFAULT_CURRENCY, INITIAL_USERS } from '../constants';
import { formatCurrency } from '../utils';

interface UserContextType {
  activeUser: UserProfile;
  householdUsers: UserProfile[];
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  setActiveUser: (userId: string) => void;
  formatAmount: (amount: number) => string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [householdUsers, setHouseholdUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [activeUserId, setActiveUserId] = useState<string>('u1');
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY);

  const activeUser =
    householdUsers.find(u => u.id === activeUserId) || householdUsers[0];

  const handleSetActiveUser = (userId: string) => {
    setActiveUserId(userId);
    setHouseholdUsers(prev =>
      prev.map(u => ({
        ...u,
        isCurrentUser: u.id === userId,
      }))
    );
  };

  const formatAmount = (amount: number): string => {
    return formatCurrency(amount, currency);
  };

  return (
    <UserContext.Provider
      value={{
        activeUser,
        householdUsers,
        currency,
        setCurrency,
        setActiveUser: handleSetActiveUser,
        formatAmount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
