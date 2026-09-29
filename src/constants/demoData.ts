import {
  Expense,
  ExpenseCategory,
  MonthlyBudget,
  ShoppingItem,
  ShoppingList,
  UserProfile,
  Wallet,
} from '../types';
import type { PersistedWalletState } from '../storage/persistence';
// Imported directly (not via '../utils') to avoid a constants <-> utils import cycle
import { getMonthKey } from '../utils/dates';
import { AVATAR_COLORS } from '../utils/members';
import { defaultWalletId, defaultWalletsFor } from '../utils/wallets';

export interface DemoData {
  expenses: Expense[];
  budget: MonthlyBudget;
  wallets: PersistedWalletState;
  lists: ShoppingList[];
}

type DemoExpense = [
  title: string,
  amount: number,
  category: ExpenseCategory,
  wallet: 'cash' | 'card',
  daysAgo: number,
];

const ACTIVE_MEMBER_EXPENSES: DemoExpense[] = [
  ['Lidl weekly shop', 46.8, 'Groceries', 'card', 0],
  ['Espresso & croissant', 3.9, 'Dining & Takeout', 'cash', 0],
  ['Metro monthly pass', 39, 'Transportation', 'card', 2],
  ['Electricity bill', 72.4, 'Utilities & Bills', 'card', 4],
  ['Pharmacy', 12.6, 'Healthcare', 'cash', 5],
  ['Cinema tickets', 18, 'Entertainment & Leisure', 'card', 6],
  ['Pizza night', 24.5, 'Dining & Takeout', 'cash', 8],
  ['Rent share', 450, 'Rent & Housing', 'card', 10],
  ['Spotify', 10.99, 'Services & Subscriptions', 'card', 12],
  ['Carrefour', 31.2, 'Groceries', 'card', 13],
  ['Haircut', 18, 'Personal Care', 'cash', 15],
  ['New sneakers', 64.9, 'Shopping', 'card', 18],
];

const OTHER_MEMBER_EXPENSES: DemoExpense[] = [
  ['Bakery', 6.4, 'Groceries', 'cash', 1],
  ['Train ticket', 14.2, 'Transportation', 'card', 3],
];

const DEMO_LIST_ITEMS: Array<Pick<ShoppingItem, 'name' | 'quantity' | 'estimatedPrice' | 'aisle'>> = [
  { name: 'Organic Whole Milk', quantity: '1L', estimatedPrice: 1.49, aisle: 'Dairy & Eggs' },
  { name: 'Sourdough Bread', quantity: '1 loaf', estimatedPrice: 2.2, aisle: 'Bakery' },
  { name: 'Fresh Bananas', quantity: '1 kg', estimatedPrice: 1.65, aisle: 'Fresh Produce' },
  { name: 'Italian Pasta (Spaghetti)', quantity: '500g', estimatedPrice: 1.15, aisle: 'Pantry & Dry Goods' },
  { name: 'Ground Espresso Coffee', quantity: '250g', estimatedPrice: 3.8, aisle: 'Beverages' },
];

/** Sample data for trying the app. Dates are relative to `now` so it always looks current. */
export function buildDemoData(users: UserProfile[], activeUserId: string, now: Date): DemoData {
  const daysAgo = (days: number, hour = 12) =>
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - days, hour).toISOString();

  const wallets: Wallet[] = users.flatMap(user => {
    const isActive = user.id === activeUserId;
    return defaultWalletsFor(user.id).map(wallet => ({
      ...wallet,
      openingBalance: wallet.type === 'cash' ? (isActive ? 120 : 50) : isActive ? 1500 : 800,
    }));
  });
  wallets.push({
    id: 'w-demo-jar',
    ownerId: activeUserId,
    name: 'Savings jar',
    type: 'cash',
    color: AVATAR_COLORS[1].color,
    openingBalance: 300,
  });

  const toExpenses = (userId: string, rows: DemoExpense[]): Expense[] =>
    rows.map(([title, amount, category, wallet, days], index) => ({
      id: `demo-exp-${userId}-${index}`,
      title,
      amount,
      category,
      date: daysAgo(days, 9 + (index % 10)),
      walletId: defaultWalletId(userId, wallet),
      paidByUserId: userId,
    }));

  const expenses = [
    ...toExpenses(activeUserId, ACTIVE_MEMBER_EXPENSES),
    ...users
      .filter(user => user.id !== activeUserId)
      .flatMap(user => toExpenses(user.id, OTHER_MEMBER_EXPENSES)),
  ];

  return {
    expenses,
    budget: {
      month: getMonthKey(now),
      totalLimit: 900,
      categoryLimits: { Groceries: 250, 'Dining & Takeout': 120 },
    },
    wallets: {
      wallets,
      incomes: [
        {
          id: 'demo-inc-salary',
          title: 'Salary',
          amount: 1850,
          walletId: defaultWalletId(activeUserId, 'card'),
          // The 1st of the current month
          date: daysAgo(now.getDate() - 1, 9),
        },
      ],
      transfers: [
        {
          id: 'demo-tr-atm',
          fromWalletId: defaultWalletId(activeUserId, 'card'),
          toWalletId: defaultWalletId(activeUserId, 'cash'),
          amount: 100,
          date: daysAgo(3, 18),
          notes: 'ATM withdrawal',
        },
      ],
    },
    lists: [
      {
        id: 'demo-list-weekly',
        name: 'Weekly groceries',
        description: 'Big weekly shop at Lidl',
        color: '#0050AA',
        shareCode: 'LID-2048',
        collaboratorIds: users.map(user => user.id),
        isArchived: false,
        createdAt: daysAgo(2),
        items: DEMO_LIST_ITEMS.map((item, index) => ({
          ...item,
          id: `demo-item-${index}`,
          isCompleted: false,
          addedByUserId: activeUserId,
        })),
      },
    ],
  };
}
