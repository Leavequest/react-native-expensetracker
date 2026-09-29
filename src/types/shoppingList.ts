export type GroceryAisle =
  | 'Fresh Produce'
  | 'Dairy & Eggs'
  | 'Meat & Fish'
  | 'Bakery'
  | 'Pantry & Dry Goods'
  | 'Frozen'
  | 'Beverages'
  | 'Household & Cleaning'
  | 'Other';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  estimatedPrice?: number;
  aisle: GroceryAisle;
  isCompleted: boolean;
  assignedToUserId?: string;
  addedByUserId: string;
  notes?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  /** Optional note shown under the name, e.g. what the list is for */
  description?: string;
  color: string;
  shareCode: string;
  collaboratorIds: string[];
  items: ShoppingItem[];
  isArchived: boolean;
  createdAt: string;
}
