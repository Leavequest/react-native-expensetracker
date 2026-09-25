import { Expense, MonthlyBudget, ShoppingList, UserProfile } from '../types';
// Imported directly (not via '../utils') to avoid a constants <-> utils import cycle
import { getCurrentMonthKey } from '../utils/dates';

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
  month: getCurrentMonthKey(),
  totalLimit: 0,
  categoryLimits: {},
};

export const INITIAL_EXPENSES: Expense[] = [];

export const INITIAL_SHOPPING_LISTS: ShoppingList[] = [];
