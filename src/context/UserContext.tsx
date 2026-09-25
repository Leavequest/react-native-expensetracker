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
  addUser: (name: string, email?: string) => UserProfile;
  updateUser: (id: string, updates: Partial<UserProfile>) => void;
  deleteUser: (userId: string) => void;
  formatAmount: (amount: number) => string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [householdUsers, setHouseholdUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [activeUserId, setActiveUserId] = useState<string>('u1');
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY);

  const activeUser =
    householdUsers.find(u => u.id === activeUserId) ||
    householdUsers[0] || {
      id: 'u1',
      name: 'You',
      initials: 'ME',
      avatarColor: '#059669',
      email: 'user@example.com',
      isCurrentUser: true,
    };

  const handleSetActiveUser = (userId: string) => {
    setActiveUserId(userId);
    setHouseholdUsers(prev =>
      prev.map(u => ({
        ...u,
        isCurrentUser: u.id === userId,
      }))
    );
  };

  const addUser = (name: string, email?: string): UserProfile => {
    const initials =
      name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'U';
    const colors = ['#059669', '#8B5CF6', '#F59E0B', '#3B82F6', '#EC4899', '#10B981'];
    const avatarColor = colors[householdUsers.length % colors.length];
    const newUser: UserProfile = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      initials,
      avatarColor,
      email: email?.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '')}@example.com`,
      isCurrentUser: false,
    };
    setHouseholdUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<UserProfile>) => {
    setHouseholdUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, ...updates } : u))
    );
  };

  const deleteUser = (userId: string) => {
    setHouseholdUsers(prev => {
      const remaining = prev.filter(u => u.id !== userId);
      if (activeUserId === userId && remaining.length > 0) {
        const nextActiveId = remaining[0].id;
        setActiveUserId(nextActiveId);
        return remaining.map(u => ({
          ...u,
          isCurrentUser: u.id === nextActiveId,
        }));
      }
      return remaining;
    });
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
        addUser,
        updateUser,
        deleteUser,
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
