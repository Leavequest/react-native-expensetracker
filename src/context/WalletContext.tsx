import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { Income, Transfer, Wallet } from '../types';
import { computeBalances, defaultWalletsFor, generateId, walletHasHistory } from '../utils';
import { PersistedWalletState, saveSlice } from '../storage/persistence';
import { useExpense } from './ExpenseContext';
import { useUser } from './UserContext';

/**
 * 'blocked': it is the member's last wallet, which must always exist.
 * 'hasBalance': money is still in it and would silently disappear from the member's total.
 */
export type RemoveWalletResult = 'deleted' | 'archived' | 'blocked' | 'hasBalance';

interface WalletContextType {
  /** Every wallet, archived ones included */
  wallets: Wallet[];
  incomes: Income[];
  transfers: Transfer[];
  balances: Record<string, number>;
  /** A member's wallets that are not archived, in creation order */
  walletsOf: (userId: string) => Wallet[];
  addWallet: (wallet: Omit<Wallet, 'id'>) => Wallet;
  updateWallet: (id: string, updates: Partial<Omit<Wallet, 'id' | 'ownerId'>>) => void;
  /** Deletes an unused wallet, archives one with history; only empty wallets can be removed */
  removeWallet: (id: string) => RemoveWalletResult;
  archiveWalletsOf: (userId: string) => void;
  addIncome: (income: Omit<Income, 'id'>) => Income;
  deleteIncome: (id: string) => void;
  /** Puts back a deleted income (used by Undo). No-op if it still exists. */
  restoreIncome: (income: Income) => void;
  addTransfer: (transfer: Omit<Transfer, 'id'>) => Transfer;
  deleteTransfer: (id: string) => void;
  /** Puts back a deleted transfer (used by Undo). No-op if it still exists. */
  restoreTransfer: (transfer: Transfer) => void;
  /** Replaces all wallet data (demo data, delete all data) */
  replaceWalletData: (data: PersistedWalletState) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
  /** Previously saved state to start from (defaults are used when omitted) */
  initialState?: PersistedWalletState;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children, initialState }) => {
  const { householdUsers } = useUser();
  const { expenses } = useExpense();

  const [wallets, setWallets] = useState<Wallet[]>(
    () => initialState?.wallets ?? householdUsers.flatMap(u => defaultWalletsFor(u.id))
  );
  const [incomes, setIncomes] = useState<Income[]>(initialState?.incomes ?? []);
  const [transfers, setTransfers] = useState<Transfer[]>(initialState?.transfers ?? []);

  useEffect(() => {
    saveSlice('wallets', { wallets, incomes, transfers });
  }, [wallets, incomes, transfers]);

  // Members without any wallet (e.g. added later) get the default pair
  useEffect(() => {
    setWallets(prev => {
      const missing = householdUsers.filter(u => !prev.some(w => w.ownerId === u.id));
      return missing.length === 0 ? prev : [...prev, ...missing.flatMap(u => defaultWalletsFor(u.id))];
    });
  }, [householdUsers]);

  const balances = useMemo(
    () => computeBalances(wallets, expenses, incomes, transfers),
    [wallets, expenses, incomes, transfers]
  );

  const walletsOf = useCallback(
    (userId: string) => wallets.filter(w => w.ownerId === userId && !w.archived),
    [wallets]
  );

  const addWallet = useCallback((data: Omit<Wallet, 'id'>): Wallet => {
    const wallet: Wallet = { ...data, id: generateId('w') };
    setWallets(prev => [...prev, wallet]);
    return wallet;
  }, []);

  const updateWallet = useCallback(
    (id: string, updates: Partial<Omit<Wallet, 'id' | 'ownerId'>>) => {
      setWallets(prev => prev.map(w => (w.id === id ? { ...w, ...updates } : w)));
    },
    []
  );

  const removeWallet = useCallback(
    (id: string): RemoveWalletResult => {
      const wallet = wallets.find(w => w.id === id);
      if (!wallet) return 'deleted';
      const othersLeft = wallets.some(
        w => w.ownerId === wallet.ownerId && !w.archived && w.id !== id
      );
      if (!othersLeft) return 'blocked';
      if (balances[id] !== 0) return 'hasBalance';
      if (walletHasHistory(id, expenses, incomes, transfers)) {
        setWallets(prev => prev.map(w => (w.id === id ? { ...w, archived: true } : w)));
        return 'archived';
      }
      setWallets(prev => prev.filter(w => w.id !== id));
      return 'deleted';
    },
    [wallets, expenses, incomes, transfers, balances]
  );

  const archiveWalletsOf = useCallback((userId: string) => {
    setWallets(prev => prev.map(w => (w.ownerId === userId ? { ...w, archived: true } : w)));
  }, []);

  const addIncome = useCallback((data: Omit<Income, 'id'>): Income => {
    const income: Income = { ...data, id: generateId('inc') };
    setIncomes(prev => [income, ...prev]);
    return income;
  }, []);

  const deleteIncome = useCallback((id: string) => {
    setIncomes(prev => prev.filter(i => i.id !== id));
  }, []);

  const restoreIncome = useCallback((income: Income) => {
    setIncomes(prev => (prev.some(i => i.id === income.id) ? prev : [income, ...prev]));
  }, []);

  const addTransfer = useCallback((data: Omit<Transfer, 'id'>): Transfer => {
    const transfer: Transfer = { ...data, id: generateId('tr') };
    setTransfers(prev => [transfer, ...prev]);
    return transfer;
  }, []);

  const deleteTransfer = useCallback((id: string) => {
    setTransfers(prev => prev.filter(t => t.id !== id));
  }, []);

  const restoreTransfer = useCallback((transfer: Transfer) => {
    setTransfers(prev => (prev.some(t => t.id === transfer.id) ? prev : [transfer, ...prev]));
  }, []);

  const replaceWalletData = useCallback((data: PersistedWalletState) => {
    setWallets(data.wallets);
    setIncomes(data.incomes);
    setTransfers(data.transfers);
  }, []);

  const value = useMemo(
    () => ({
      wallets,
      incomes,
      transfers,
      balances,
      walletsOf,
      addWallet,
      updateWallet,
      removeWallet,
      archiveWalletsOf,
      addIncome,
      deleteIncome,
      restoreIncome,
      addTransfer,
      deleteTransfer,
      restoreTransfer,
      replaceWalletData,
    }),
    [
      wallets,
      incomes,
      transfers,
      balances,
      walletsOf,
      addWallet,
      updateWallet,
      removeWallet,
      archiveWalletsOf,
      addIncome,
      deleteIncome,
      restoreIncome,
      addTransfer,
      deleteTransfer,
      restoreTransfer,
      replaceWalletData,
    ]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
