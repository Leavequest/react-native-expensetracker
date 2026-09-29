export type ExpenseCategory =
  | 'Groceries'
  | 'Rent & Housing'
  | 'Utilities & Bills'
  | 'Dining & Takeout'
  | 'Transportation'
  | 'Healthcare'
  | 'Entertainment & Leisure'
  | 'Shopping'
  | 'Personal Care'
  | 'Services & Subscriptions';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO string e.g. YYYY-MM-DDTHH:mm:ss.sssZ
  /** Wallet the money came out of */
  walletId: string;
  notes?: string;
  linkedShoppingListId?: string;
  paidByUserId: string;
}

export interface MonthlyBudget {
  month: string; // YYYY-MM
  totalLimit: number;
  categoryLimits: Partial<Record<ExpenseCategory, number>>;
}
