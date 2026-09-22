import { ExpenseCategory, GroceryAisle, PaymentMethod } from '../types';

export interface CategoryInfo {
  name: ExpenseCategory;
  icon: string;
  color: string;
}

export const EXPENSE_CATEGORIES: CategoryInfo[] = [
  { name: 'Groceries', icon: '🛒', color: '#10B981' },
  { name: 'Rent & Housing', icon: '🏠', color: '#6366F1' },
  { name: 'Utilities & Bills', icon: '💡', color: '#F59E0B' },
  { name: 'Dining & Takeout', icon: '🍽️', color: '#EF4444' },
  { name: 'Transportation', icon: '🚇', color: '#3B82F6' },
  { name: 'Healthcare', icon: '💊', color: '#EC4899' },
  { name: 'Entertainment & Leisure', icon: '🎟️', color: '#8B5CF6' },
  { name: 'Shopping', icon: '🛍️', color: '#14B8A6' },
  { name: 'Personal Care', icon: '✨', color: '#F97316' },
  { name: 'Services & Subscriptions', icon: '📱', color: '#64748B' },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  'Debit Card',
  'Credit Card',
  'Apple Pay / Google Pay',
  'Cash',
  'Bank Transfer / SEPA',
];

export interface AisleInfo {
  name: GroceryAisle;
  icon: string;
  color: string;
}

export const GROCERY_AISLES: AisleInfo[] = [
  { name: 'Fresh Produce', icon: '🥬', color: '#10B981' },
  { name: 'Dairy & Eggs', icon: '🧀', color: '#FBBF24' },
  { name: 'Meat & Fish', icon: '🥩', color: '#F87171' },
  { name: 'Bakery', icon: '🥖', color: '#F59E0B' },
  { name: 'Pantry & Dry Goods', icon: '🍝', color: '#A855F7' },
  { name: 'Frozen', icon: '❄️', color: '#38BDF8' },
  { name: 'Beverages', icon: '☕', color: '#06B6D4' },
  { name: 'Household & Cleaning', icon: '🧼', color: '#64748B' },
  { name: 'Other', icon: '📦', color: '#94A3B8' },
];

export interface StorePreset {
  name: string;
  color: string;
}

export const EUROPEAN_STORES: StorePreset[] = [
  { name: 'Lidl', color: '#0050AA' },
  { name: 'Aldi', color: '#001A9C' },
  { name: 'Carrefour', color: '#004F9F' },
  { name: 'Tesco', color: '#00539F' },
  { name: 'Spar', color: '#008542' },
  { name: 'Mercadona', color: '#00833B' },
  { name: 'Rewe', color: '#CC0000' },
  { name: 'Coop', color: '#E35205' },
  { name: 'Supermarket / General', color: '#059669' },
];

export interface QuickGroceryPreset {
  name: string;
  aisle: GroceryAisle;
  defaultPrice: number;
  quantity: string;
}

export const QUICK_GROCERY_ITEMS: QuickGroceryPreset[] = [
  { name: 'Organic Whole Milk', aisle: 'Dairy & Eggs', defaultPrice: 1.49, quantity: '1L' },
  { name: 'Free-Range Eggs (6pk)', aisle: 'Dairy & Eggs', defaultPrice: 2.39, quantity: '1 pack' },
  { name: 'Sourdough Bread', aisle: 'Bakery', defaultPrice: 2.20, quantity: '1 loaf' },
  { name: 'Extra Virgin Olive Oil', aisle: 'Pantry & Dry Goods', defaultPrice: 6.99, quantity: '750ml' },
  { name: 'Fresh Bananas', aisle: 'Fresh Produce', defaultPrice: 1.65, quantity: '1 kg' },
  { name: 'Italian Pasta (Spaghetti)', aisle: 'Pantry & Dry Goods', defaultPrice: 1.15, quantity: '500g' },
  { name: 'Greek Yogurt 500g', aisle: 'Dairy & Eggs', defaultPrice: 1.89, quantity: '1 tub' },
  { name: 'Ripe Tomatoes', aisle: 'Fresh Produce', defaultPrice: 2.10, quantity: '500g' },
  { name: 'Ground Espresso Coffee', aisle: 'Beverages', defaultPrice: 3.80, quantity: '250g' },
  { name: 'Mineral Water (6x1.5L)', aisle: 'Beverages', defaultPrice: 2.50, quantity: '6 pack' },
  { name: 'Dish Soap', aisle: 'Household & Cleaning', defaultPrice: 1.75, quantity: '1 bottle' },
  { name: 'Chicken Breast Fillets', aisle: 'Meat & Fish', defaultPrice: 5.90, quantity: '400g' },
];
