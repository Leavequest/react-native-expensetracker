import { Expense, MonthlyBudget, ShoppingList, UserProfile } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'u1',
    name: 'You',
    initials: 'ME',
    avatarColor: '#059669',
    email: 'user@example.com',
    isCurrentUser: true,
  },
];

export const INITIAL_BUDGET: MonthlyBudget = {
  month: new Date().toISOString().slice(0, 7),
  totalLimit: 0,
  categoryLimits: {},
};

export const INITIAL_EXPENSES: Expense[] = [];

export const INITIAL_SHOPPING_LISTS: ShoppingList[] = [];
