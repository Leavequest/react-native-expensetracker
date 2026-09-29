import { createAsyncStorage } from '@react-native-async-storage/async-storage';
import {
  CurrencyCode,
  Expense,
  Income,
  MonthlyBudget,
  ShoppingList,
  Transfer,
  UserProfile,
  Wallet,
} from '../types';
import { withMemberDefaults } from '../utils/members';
import { defaultWalletId } from '../utils/wallets';

const storage = createAsyncStorage('expense-tracker');

/**
 * Bump this when the shape of persisted data changes, and handle the
 * older version in the matching `parse*` function below.
 */
const SCHEMA_VERSION = 1;

export interface PersistedUserState {
  users: UserProfile[];
  activeUserId: string;
  currency: CurrencyCode;
}

export interface PersistedExpenseState {
  expenses: Expense[];
  budget: MonthlyBudget;
}

export interface PersistedShoppingState {
  lists: ShoppingList[];
}

export type ThemeMode = 'light' | 'dark';

export interface PersistedThemeState {
  mode: ThemeMode;
}

export interface PersistedWalletState {
  wallets: Wallet[];
  incomes: Income[];
  transfers: Transfer[];
}

export interface PersistedAppState {
  user?: PersistedUserState;
  expenses?: PersistedExpenseState;
  shopping?: PersistedShoppingState;
  theme?: PersistedThemeState;
  wallets?: PersistedWalletState;
}

type SliceKey = keyof PersistedAppState;

const SLICE_KEYS: SliceKey[] = ['user', 'expenses', 'shopping', 'theme', 'wallets'];

interface Envelope {
  version: number;
  data: unknown;
}

function unwrap(raw: string | null | undefined): Record<string, unknown> | undefined {
  if (!raw) return undefined;
  try {
    const envelope = JSON.parse(raw) as Envelope;
    if (envelope?.version !== SCHEMA_VERSION) return undefined;
    const { data } = envelope;
    return data && typeof data === 'object' ? (data as Record<string, unknown>) : undefined;
  } catch {
    return undefined;
  }
}

function parseUser(raw: string | null | undefined): PersistedUserState | undefined {
  const data = unwrap(raw);
  if (
    !data ||
    !Array.isArray(data.users) ||
    data.users.length === 0 ||
    typeof data.activeUserId !== 'string' ||
    typeof data.currency !== 'string'
  ) {
    return undefined;
  }
  const state = data as unknown as PersistedUserState;
  return { ...state, users: withMemberDefaults(state.users) };
}

/** Expenses saved before wallets existed carry a payment method instead of a wallet id. */
type LegacyExpense = Expense & { paymentMethod?: string };

function migrateExpense(expense: LegacyExpense): Expense {
  if (expense.walletId) return expense;
  const { paymentMethod, ...rest } = expense;
  const type = paymentMethod === 'Cash' ? 'cash' : 'card';
  return { ...rest, walletId: defaultWalletId(expense.paidByUserId, type) };
}

function parseExpenses(raw: string | null | undefined): PersistedExpenseState | undefined {
  const data = unwrap(raw);
  if (!data || !Array.isArray(data.expenses) || !data.budget || typeof data.budget !== 'object') {
    return undefined;
  }
  const state = data as unknown as PersistedExpenseState;
  return { ...state, expenses: (state.expenses as LegacyExpense[]).map(migrateExpense) };
}

function parseShopping(raw: string | null | undefined): PersistedShoppingState | undefined {
  const data = unwrap(raw);
  if (!data || !Array.isArray(data.lists)) return undefined;
  return data as unknown as PersistedShoppingState;
}

function parseTheme(raw: string | null | undefined): PersistedThemeState | undefined {
  const data = unwrap(raw);
  if (!data || (data.mode !== 'light' && data.mode !== 'dark')) return undefined;
  return data as unknown as PersistedThemeState;
}

function parseWallets(raw: string | null | undefined): PersistedWalletState | undefined {
  const data = unwrap(raw);
  if (
    !data ||
    !Array.isArray(data.wallets) ||
    !Array.isArray(data.incomes) ||
    !Array.isArray(data.transfers)
  ) {
    return undefined;
  }
  return data as unknown as PersistedWalletState;
}

/**
 * Loads everything saved on the device. Any slice that is missing or
 * unreadable is left undefined so its provider falls back to defaults.
 */
export async function loadAppState(): Promise<PersistedAppState> {
  try {
    const raw = await storage.getMany(SLICE_KEYS);
    return {
      user: parseUser(raw.user),
      expenses: parseExpenses(raw.expenses),
      shopping: parseShopping(raw.shopping),
      theme: parseTheme(raw.theme),
      wallets: parseWallets(raw.wallets),
    };
  } catch (error) {
    console.warn('[persistence] Failed to load saved data, using defaults', error);
    return {};
  }
}

/**
 * Saves one slice of app state. Fire-and-forget: a failed write is logged
 * but never interrupts the UI.
 */
export function saveSlice<K extends SliceKey>(
  key: K,
  data: NonNullable<PersistedAppState[K]>
): Promise<void> {
  const envelope: Envelope = { version: SCHEMA_VERSION, data };
  return storage.setItem(key, JSON.stringify(envelope)).catch(error => {
    console.warn(`[persistence] Failed to save "${key}"`, error);
  });
}
