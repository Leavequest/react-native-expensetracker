import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { Expense, ExpenseCategory, MonthlyBudget } from '../types';
import { INITIAL_BUDGET, INITIAL_EXPENSES } from '../constants';
import { generateId, getCurrentMonthKey, isDateInMonth } from '../utils';
import { PersistedExpenseState, saveSlice } from '../storage/persistence';

export interface CategorySpending {
  category: ExpenseCategory;
  spent: number;
  limit?: number;
  percentage: number;
}

interface ExpenseContextType {
  expenses: Expense[];
  currentMonthExpenses: Expense[];
  budget: MonthlyBudget;
  totalSpentThisMonth: number;
  budgetRemaining: number;
  budgetUsagePercent: number;
  categoryBreakdown: CategorySpending[];
  addExpense: (expense: Omit<Expense, 'id'>) => Expense;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  /** Puts back a deleted expense (used by Undo). No-op if it still exists. */
  restoreExpense: (expense: Expense) => void;
  setTotalBudget: (amount: number) => void;
  setCategoryBudget: (category: ExpenseCategory, limit: number) => void;
  resetExpensesToDefault: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

interface ExpenseProviderProps {
  children: ReactNode;
  /** Previously saved state to start from (defaults are used when omitted) */
  initialState?: PersistedExpenseState;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children, initialState }) => {
  const [expenses, setExpenses] = useState<Expense[]>(
    initialState?.expenses ?? INITIAL_EXPENSES
  );
  const [budget, setBudget] = useState<MonthlyBudget>(initialState?.budget ?? INITIAL_BUDGET);

  useEffect(() => {
    saveSlice('expenses', { expenses, budget });
  }, [expenses, budget]);

  const currentMonthKey = getCurrentMonthKey();

  const currentMonthExpenses = useMemo(
    () => expenses.filter(exp => isDateInMonth(exp.date, currentMonthKey)),
    [expenses, currentMonthKey]
  );

  const totalSpentThisMonth = useMemo(
    () => currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    [currentMonthExpenses]
  );

  const budgetRemaining = Math.max(0, budget.totalLimit - totalSpentThisMonth);

  const budgetUsagePercent =
    budget.totalLimit > 0
      ? Math.min(100, Math.round((totalSpentThisMonth / budget.totalLimit) * 100))
      : 0;

  const categoryBreakdown = useMemo(() => {
    const categoryTotals: Partial<Record<ExpenseCategory, number>> = {};

    currentMonthExpenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const breakdown: CategorySpending[] = (
      Object.entries(categoryTotals) as [ExpenseCategory, number][]
    ).map(([category, spent]) => ({
      category,
      spent,
      limit: budget.categoryLimits[category],
      percentage:
        totalSpentThisMonth > 0 ? Math.round((spent / totalSpentThisMonth) * 100) : 0,
    }));

    return breakdown.sort((a, b) => b.spent - a.spent);
  }, [currentMonthExpenses, budget.categoryLimits, totalSpentThisMonth]);

  const addExpense = useCallback((newExpenseData: Omit<Expense, 'id'>): Expense => {
    const newExpense: Expense = { ...newExpenseData, id: generateId('exp') };
    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  }, []);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(exp => (exp.id === id ? { ...exp, ...updates } : exp)));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  }, []);

  const restoreExpense = useCallback((expense: Expense) => {
    setExpenses(prev => (prev.some(e => e.id === expense.id) ? prev : [expense, ...prev]));
  }, []);

  const setTotalBudget = useCallback((amount: number) => {
    setBudget(prev => ({ ...prev, totalLimit: amount }));
  }, []);

  const setCategoryBudget = useCallback((category: ExpenseCategory, limit: number) => {
    setBudget(prev => ({
      ...prev,
      categoryLimits: { ...prev.categoryLimits, [category]: limit },
    }));
  }, []);

  const resetExpensesToDefault = useCallback(() => {
    setExpenses(INITIAL_EXPENSES);
    setBudget(INITIAL_BUDGET);
  }, []);

  const value = useMemo(
    () => ({
      expenses,
      currentMonthExpenses,
      budget,
      totalSpentThisMonth,
      budgetRemaining,
      budgetUsagePercent,
      categoryBreakdown,
      addExpense,
      updateExpense,
      deleteExpense,
      restoreExpense,
      setTotalBudget,
      setCategoryBudget,
      resetExpensesToDefault,
    }),
    [
      expenses,
      currentMonthExpenses,
      budget,
      totalSpentThisMonth,
      budgetRemaining,
      budgetUsagePercent,
      categoryBreakdown,
      addExpense,
      updateExpense,
      deleteExpense,
      restoreExpense,
      setTotalBudget,
      setCategoryBudget,
      resetExpensesToDefault,
    ]
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};

export const useExpense = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
