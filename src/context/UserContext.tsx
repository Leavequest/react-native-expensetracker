import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { CurrencyCode, UserProfile } from '../types';
import { DEFAULT_CURRENCY, INITIAL_USERS } from '../constants';
import { AVATAR_COLORS, formatCurrency, generateId, getInitials } from '../utils';
import { PersistedUserState, saveSlice } from '../storage/persistence';

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

interface UserProviderProps {
  children: ReactNode;
  /** Previously saved state to start from (defaults are used when omitted) */
  initialState?: PersistedUserState;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children, initialState }) => {
  const [users, setUsers] = useState<UserProfile[]>(initialState?.users ?? INITIAL_USERS);
  const [activeUserId, setActiveUserId] = useState<string>(
    initialState?.activeUserId ?? INITIAL_USERS[0].id
  );
  const [currency, setCurrency] = useState<CurrencyCode>(
    initialState?.currency ?? DEFAULT_CURRENCY
  );

  useEffect(() => {
    saveSlice('user', { users, activeUserId, currency });
  }, [users, activeUserId, currency]);

  // Fall back to the first member if the active one no longer exists (e.g. was deleted)
  const resolvedActiveId = users.some(u => u.id === activeUserId)
    ? activeUserId
    : users[0]?.id;

  // isCurrentUser is derived from the active id so the two can never drift apart
  const householdUsers = useMemo(
    () => users.map(u => ({ ...u, isCurrentUser: u.id === resolvedActiveId })),
    [users, resolvedActiveId]
  );

  const activeUser =
    householdUsers.find(u => u.isCurrentUser) ?? INITIAL_USERS[0];

  const addUser = useCallback(
    (name: string, email?: string): UserProfile => {
      const trimmedName = name.trim();
      const newUser: UserProfile = {
        id: generateId('u'),
        name: trimmedName,
        initials: getInitials(trimmedName),
        avatarColor: AVATAR_COLORS[users.length % AVATAR_COLORS.length].color,
        email:
          email?.trim() ||
          `${trimmedName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        isCurrentUser: false,
        role: 'member',
        origin: 'local',
        status: 'active',
      };
      setUsers(prev => [...prev, newUser]);
      return newUser;
    },
    [users.length]
  );

  const updateUser = useCallback((id: string, updates: Partial<UserProfile>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
  }, []);

  const deleteUser = useCallback((userId: string) => {
    // At least one household member must always exist
    setUsers(prev => (prev.length <= 1 ? prev : prev.filter(u => u.id !== userId)));
  }, []);

  const formatAmount = useCallback(
    (amount: number): string => formatCurrency(amount, currency),
    [currency]
  );

  const value = useMemo(
    () => ({
      activeUser,
      householdUsers,
      currency,
      setCurrency,
      setActiveUser: setActiveUserId,
      addUser,
      updateUser,
      deleteUser,
      formatAmount,
    }),
    [activeUser, householdUsers, currency, addUser, updateUser, deleteUser, formatAmount]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
