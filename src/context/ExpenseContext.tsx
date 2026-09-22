import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Expense, ExpenseCategory, MonthlyBudget } from '../types';
import { INITIAL_BUDGET, INITIAL_EXPENSES } from '../constants';
import { getCurrentMonthKey } from '../utils';

export interface CategorySpending {
  category: ExpenseCategory;
  spent: number;
  limit?: number;
  percentage: number;
}

interface ExpenseContextType {
  expenses: Expense[];
  budget: MonthlyBudget;
  totalSpentThisMonth: number;
  budgetRemaining: number;
  budgetUsagePercent: number;
  categoryBreakdown: CategorySpending[];
  addExpense: (expense: Omit<Expense, 'id'>) => Expense;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setTotalBudget: (amount: number) => void;
  setCategoryBudget: (category: ExpenseCategory, limit: number) => void;
  resetExpensesToDefault: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [budget, setBudget] = useState<MonthlyBudget>(INITIAL_BUDGET);

  const currentMonthKey = getCurrentMonthKey();

  const totalSpentThisMonth = useMemo(() => {
    return expenses.reduce((sum, exp) => {
      // Filter expenses for current month
      if (exp.date && exp.date.startsWith(currentMonthKey)) {
        return sum + exp.amount;
      }
      return sum;
    }, 0);
  }, [expenses, currentMonthKey]);

  const budgetRemaining = useMemo(() => {
    return Math.max(0, budget.totalLimit - totalSpentThisMonth);
  }, [budget.totalLimit, totalSpentThisMonth]);

  const budgetUsagePercent = useMemo(() => {
    if (budget.totalLimit <= 0) return 0;
    return Math.min(100, Math.round((totalSpentThisMonth / budget.totalLimit) * 100));
  }, [budget.totalLimit, totalSpentThisMonth]);

  const categoryBreakdown = useMemo(() => {
    const categoryTotals: Record<string, number> = {};

    expenses.forEach(exp => {
      if (exp.date && exp.date.startsWith(currentMonthKey)) {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      }
    });

    const breakdown: CategorySpending[] = Object.entries(categoryTotals).map(
      ([cat, spent]) => {
        const category = cat as ExpenseCategory;
        const limit = budget.categoryLimits[category];
        const percentage = totalSpentThisMonth > 0 ? (spent / totalSpentThisMonth) * 100 : 0;
        return {
          category,
          spent,
          limit,
          percentage: Math.round(percentage),
        };
      }
    );

    return breakdown.sort((a, b) => b.spent - a.spent);
  }, [expenses, budget.categoryLimits, totalSpentThisMonth, currentMonthKey]);

  const addExpense = (newExpenseData: Omit<Expense, 'id'>): Expense => {
    const newExpense: Expense = {
      ...newExpenseData,
      id: `exp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev =>
      prev.map(exp => (exp.id === id ? { ...exp, ...updates } : exp))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const setTotalBudget = (amount: number) => {
    setBudget(prev => ({
      ...prev,
      totalLimit: amount,
    }));
  };

  const setCategoryBudget = (category: ExpenseCategory, limit: number) => {
    setBudget(prev => ({
      ...prev,
      categoryLimits: {
        ...prev.categoryLimits,
        [category]: limit,
      },
    }));
  };

  const resetExpensesToDefault = () => {
    setExpenses(INITIAL_EXPENSES);
    setBudget(INITIAL_BUDGET);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        budget,
        totalSpentThisMonth,
        budgetRemaining,
        budgetUsagePercent,
        categoryBreakdown,
        addExpense,
        updateExpense,
        deleteExpense,
        setTotalBudget,
        setCategoryBudget,
        resetExpensesToDefault,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
