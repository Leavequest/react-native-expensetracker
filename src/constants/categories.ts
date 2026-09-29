import { ExpenseCategory, GroceryAisle } from '../types';
// Type-only import: constants must not pull UI components in at runtime
import type { IconName } from '../components/common/Icon';

export interface CategoryInfo {
  name: ExpenseCategory;
  icon: IconName;
  color: string;
}

export const EXPENSE_CATEGORIES: CategoryInfo[] = [
  { name: 'Groceries', icon: 'cart', color: '#10B981' },
  { name: 'Rent & Housing', icon: 'home', color: '#6366F1' },
  { name: 'Utilities & Bills', icon: 'bulb', color: '#F59E0B' },
  { name: 'Dining & Takeout', icon: 'dining', color: '#EF4444' },
  { name: 'Transportation', icon: 'transit', color: '#3B82F6' },
  { name: 'Healthcare', icon: 'health', color: '#EC4899' },
  { name: 'Entertainment & Leisure', icon: 'ticket', color: '#8B5CF6' },
  { name: 'Shopping', icon: 'bag', color: '#14B8A6' },
  { name: 'Personal Care', icon: 'sparkles', color: '#F97316' },
  { name: 'Services & Subscriptions', icon: 'phone', color: '#64748B' },
];

export interface AisleInfo {
  name: GroceryAisle;
  icon: IconName;
  color: string;
}

export const GROCERY_AISLES: AisleInfo[] = [
  { name: 'Fresh Produce', icon: 'produce', color: '#10B981' },
  { name: 'Dairy & Eggs', icon: 'dairy', color: '#FBBF24' },
  { name: 'Meat & Fish', icon: 'meat', color: '#F87171' },
  { name: 'Bakery', icon: 'bakery', color: '#F59E0B' },
  { name: 'Pantry & Dry Goods', icon: 'pantry', color: '#A855F7' },
  { name: 'Frozen', icon: 'frozen', color: '#38BDF8' },
  { name: 'Beverages', icon: 'drinks', color: '#06B6D4' },
  { name: 'Household & Cleaning', icon: 'cleaning', color: '#64748B' },
  { name: 'Other', icon: 'package', color: '#94A3B8' },
];

/** Display info for an expense category, with a neutral fallback for unknown values. */
export function getCategoryInfo(category: ExpenseCategory): CategoryInfo {
  return (
    EXPENSE_CATEGORIES.find(c => c.name === category) ?? {
      name: category,
      icon: 'wallet',
      color: '#64748B',
    }
  );
}

/** Display info for a grocery aisle, with a neutral fallback for unknown values. */
export function getAisleInfo(aisle: GroceryAisle): AisleInfo {
  return (
    GROCERY_AISLES.find(a => a.name === aisle) ?? { name: aisle, icon: 'package', color: '#94A3B8' }
  );
}

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
