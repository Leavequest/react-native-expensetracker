import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { ShoppingItem, ShoppingList } from '../types';
import { INITIAL_SHOPPING_LISTS, THEME } from '../constants';
import { generateId } from '../utils';
import { PersistedShoppingState, saveSlice } from '../storage/persistence';
import { useExpense } from './ExpenseContext';
import { useUser } from './UserContext';

interface ShoppingListContextType {
  lists: ShoppingList[];
  createList: (name: string, storeName: string, color?: string) => ShoppingList;
  updateList: (id: string, updates: Partial<ShoppingList>) => void;
  deleteList: (id: string) => void;
  addItem: (
    listId: string,
    item: Omit<ShoppingItem, 'id' | 'isCompleted'>
  ) => ShoppingItem;
  toggleItemCompleted: (listId: string, itemId: string) => void;
  deleteItem: (listId: string, itemId: string) => void;
  /** Puts back a deleted item at its old position (used by Undo). No-op if it still exists. */
  restoreItem: (listId: string, item: ShoppingItem, index: number) => void;
  joinListByCode: (code: string) => boolean;
  /** Drops a deleted household member from every list and unassigns their items. */
  removeMemberFromLists: (userId: string) => void;
  /**
   * Records the trip as a Groceries expense and unchecks all items.
   * Returns null if the list doesn't exist or there is no amount to record.
   */
  finishShoppingTrip: (
    listId: string,
    actualAmount?: number
  ) => { totalAmount: number; expenseId: string } | null;
  resetShoppingListsToDefault: () => void;
}

/**
 * Builds a share code like "LID-4821", retrying until it doesn't clash
 * with an existing list.
 */
function generateShareCode(storeName: string, existingLists: ShoppingList[]): string {
  const prefix = storeName.replace(/[^a-z]/gi, '').substring(0, 3).toUpperCase() || 'LST';
  const existingCodes = new Set(existingLists.map(l => l.shareCode.toUpperCase()));
  let code: string;
  do {
    code = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
  } while (existingCodes.has(code));
  return code;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

interface ShoppingListProviderProps {
  children: ReactNode;
  /** Previously saved state to start from (defaults are used when omitted) */
  initialState?: PersistedShoppingState;
}

export const ShoppingListProvider: React.FC<ShoppingListProviderProps> = ({
  children,
  initialState,
}) => {
  const [lists, setLists] = useState<ShoppingList[]>(
    initialState?.lists ?? INITIAL_SHOPPING_LISTS
  );

  useEffect(() => {
    saveSlice('shopping', { lists });
  }, [lists]);
  const { addExpense } = useExpense();
  const { activeUser } = useUser();
  const activeUserId = activeUser.id;

  /** Applies `update` to the items of a single list. */
  const updateListItems = useCallback(
    (listId: string, update: (items: ShoppingItem[]) => ShoppingItem[]) => {
      setLists(prev =>
        prev.map(list => (list.id === listId ? { ...list, items: update(list.items) } : list))
      );
    },
    []
  );

  const createList = useCallback(
    (name: string, storeName: string, color?: string): ShoppingList => {
      const newList: ShoppingList = {
        id: generateId('list'),
        name,
        storeName,
        color: color || THEME.colors.primary,
        shareCode: generateShareCode(storeName, lists),
        collaboratorIds: [activeUserId],
        items: [],
        isArchived: false,
        createdAt: new Date().toISOString(),
      };

      setLists(prev => [newList, ...prev]);
      return newList;
    },
    [lists, activeUserId]
  );

  const updateList = useCallback((id: string, updates: Partial<ShoppingList>) => {
    setLists(prev => prev.map(list => (list.id === id ? { ...list, ...updates } : list)));
  }, []);

  const deleteList = useCallback((id: string) => {
    setLists(prev => prev.filter(list => list.id !== id));
  }, []);

  const addItem = useCallback(
    (listId: string, itemData: Omit<ShoppingItem, 'id' | 'isCompleted'>): ShoppingItem => {
      const newItem: ShoppingItem = {
        ...itemData,
        id: generateId('item'),
        isCompleted: false,
      };
      updateListItems(listId, items => [newItem, ...items]);
      return newItem;
    },
    [updateListItems]
  );

  const toggleItemCompleted = useCallback(
    (listId: string, itemId: string) => {
      updateListItems(listId, items =>
        items.map(item =>
          item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
        )
      );
    },
    [updateListItems]
  );

  const deleteItem = useCallback(
    (listId: string, itemId: string) => {
      updateListItems(listId, items => items.filter(item => item.id !== itemId));
    },
    [updateListItems]
  );

  const restoreItem = useCallback(
    (listId: string, item: ShoppingItem, index: number) => {
      updateListItems(listId, items =>
        items.some(i => i.id === item.id)
          ? items
          : [...items.slice(0, index), item, ...items.slice(index)]
      );
    },
    [updateListItems]
  );

  const joinListByCode = useCallback(
    (code: string): boolean => {
      const normalized = code.trim().toUpperCase();
      const found = lists.find(l => l.shareCode.toUpperCase() === normalized);
      if (!found) return false;

      if (!found.collaboratorIds.includes(activeUserId)) {
        updateList(found.id, {
          collaboratorIds: [...found.collaboratorIds, activeUserId],
        });
      }
      return true;
    },
    [lists, activeUserId, updateList]
  );

  const removeMemberFromLists = useCallback((userId: string) => {
    setLists(prev =>
      prev.map(list => ({
        ...list,
        collaboratorIds: list.collaboratorIds.filter(id => id !== userId),
        items: list.items.map(item =>
          item.assignedToUserId === userId ? { ...item, assignedToUserId: undefined } : item
        ),
      }))
    );
  }, []);

  const finishShoppingTrip = useCallback(
    (
      listId: string,
      actualAmount?: number
    ): { totalAmount: number; expenseId: string } | null => {
      const targetList = lists.find(l => l.id === listId);
      if (!targetList) return null;

      // Sum the items in the cart, or every item if nothing was checked off
      const completedItems = targetList.items.filter(i => i.isCompleted);
      const itemsToSum = completedItems.length > 0 ? completedItems : targetList.items;

      const estimatedTotal = itemsToSum.reduce(
        (sum, i) => sum + (i.estimatedPrice || 0),
        0
      );

      const finalAmount =
        typeof actualAmount === 'number' && actualAmount > 0
          ? actualAmount
          : Math.round(estimatedTotal * 100) / 100;

      if (finalAmount <= 0) return null;

      const createdExpense = addExpense({
        title: `${targetList.storeName} - ${targetList.name}`,
        amount: finalAmount,
        category: 'Groceries',
        date: new Date().toISOString(),
        paymentMethod: 'Debit Card',
        paidByUserId: activeUserId,
        linkedShoppingListId: targetList.id,
        notes: `Finished shopping trip (${completedItems.length}/${targetList.items.length} items acquired)`,
      });

      // Reset the list so it can be reused for the next trip
      updateListItems(listId, items => items.map(item => ({ ...item, isCompleted: false })));

      return {
        totalAmount: finalAmount,
        expenseId: createdExpense.id,
      };
    },
    [lists, activeUserId, addExpense, updateListItems]
  );

  const resetShoppingListsToDefault = useCallback(() => {
    setLists(INITIAL_SHOPPING_LISTS);
  }, []);

  const value = useMemo(
    () => ({
      lists,
      createList,
      updateList,
      deleteList,
      addItem,
      toggleItemCompleted,
      deleteItem,
      restoreItem,
      joinListByCode,
      removeMemberFromLists,
      finishShoppingTrip,
      resetShoppingListsToDefault,
    }),
    [
      lists,
      createList,
      updateList,
      deleteList,
      addItem,
      toggleItemCompleted,
      deleteItem,
      restoreItem,
      joinListByCode,
      removeMemberFromLists,
      finishShoppingTrip,
      resetShoppingListsToDefault,
    ]
  );

  return (
    <ShoppingListContext.Provider value={value}>{children}</ShoppingListContext.Provider>
  );
};

export const useShoppingList = (): ShoppingListContextType => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};
