import { useCallback } from 'react';
import { buildDemoData, DEFAULT_CURRENCY, INITIAL_BUDGET } from '../constants';
import { defaultWalletsFor, getCurrentMonthKey } from '../utils';
import { useExpense } from './ExpenseContext';
import { useShoppingList } from './ShoppingListContext';
import { useUser } from './UserContext';
import { useWallet } from './WalletContext';

/** "Load demo data" and "Delete all data" from Settings. Household members are kept. */
export function useAppData(): { loadDemoData: () => void; deleteAllData: () => void } {
  const { householdUsers, activeUser, setCurrency } = useUser();
  const { replaceExpenses } = useExpense();
  const { replaceWalletData } = useWallet();
  const { replaceLists } = useShoppingList();

  const loadDemoData = useCallback(() => {
    const demo = buildDemoData(householdUsers, activeUser.id, new Date());
    replaceExpenses(demo.expenses, demo.budget);
    replaceWalletData(demo.wallets);
    replaceLists(demo.lists);
  }, [householdUsers, activeUser.id, replaceExpenses, replaceWalletData, replaceLists]);

  const deleteAllData = useCallback(() => {
    replaceExpenses([], { ...INITIAL_BUDGET, month: getCurrentMonthKey() });
    replaceWalletData({
      wallets: householdUsers.flatMap(user => defaultWalletsFor(user.id)),
      incomes: [],
      transfers: [],
    });
    replaceLists([]);
    setCurrency(DEFAULT_CURRENCY);
  }, [householdUsers, replaceExpenses, replaceWalletData, replaceLists, setCurrency]);

  return { loadDemoData, deleteAllData };
}
