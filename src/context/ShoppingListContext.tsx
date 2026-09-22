import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ShoppingItem, ShoppingList } from '../types';
import { INITIAL_SHOPPING_LISTS } from '../constants';
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
  joinListByCode: (code: string) => boolean;
  finishShoppingTrip: (
    listId: string,
    actualAmount?: number
  ) => { totalAmount: number; expenseId: string } | null;
  resetShoppingListsToDefault: () => void;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export const ShoppingListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<ShoppingList[]>(INITIAL_SHOPPING_LISTS);
  const { addExpense } = useExpense();
  const { activeUser } = useUser();

  const createList = (name: string, storeName: string, color?: string): ShoppingList => {
    const randomCode = `${storeName.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newList: ShoppingList = {
      id: `list-${Date.now()}`,
      name,
      storeName,
      color: color || '#059669',
      shareCode: randomCode,
      collaboratorIds: [activeUser.id],
      items: [],
      isArchived: false,
      createdAt: new Date().toISOString(),
    };

    setLists(prev => [newList, ...prev]);
    return newList;
  };

  const updateList = (id: string, updates: Partial<ShoppingList>) => {
    setLists(prev =>
      prev.map(list => (list.id === id ? { ...list, ...updates } : list))
    );
  };

  const deleteList = (id: string) => {
    setLists(prev => prev.filter(list => list.id !== id));
  };

  const addItem = (
    listId: string,
    itemData: Omit<ShoppingItem, 'id' | 'isCompleted'>
  ): ShoppingItem => {
    const newItem: ShoppingItem = {
      ...itemData,
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isCompleted: false,
    };

    setLists(prev =>
      prev.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            items: [newItem, ...list.items],
          };
        }
        return list;
      })
    );

    return newItem;
  };

  const toggleItemCompleted = (listId: string, itemId: string) => {
    setLists(prev =>
      prev.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.map(item =>
              item.id === itemId
                ? { ...item, isCompleted: !item.isCompleted }
                : item
            ),
          };
        }
        return list;
      })
    );
  };

  const deleteItem = (listId: string, itemId: string) => {
    setLists(prev =>
      prev.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.filter(item => item.id !== itemId),
          };
        }
        return list;
      })
    );
  };

  const joinListByCode = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    const found = lists.find(l => l.shareCode.toUpperCase() === normalized);
    if (!found) return false;

    if (!found.collaboratorIds.includes(activeUser.id)) {
      setLists(prev =>
        prev.map(l =>
          l.id === found.id
            ? { ...l, collaboratorIds: [...l.collaboratorIds, activeUser.id] }
            : l
        )
      );
    }
    return true;
  };

  const finishShoppingTrip = (
    listId: string,
    actualAmount?: number
  ): { totalAmount: number; expenseId: string } | null => {
    const targetList = lists.find(l => l.id === listId);
    if (!targetList) return null;

    // Calculate sum of completed items or fallback to all items
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

    // Create expense in ExpenseContext
    const createdExpense = addExpense({
      title: `${targetList.storeName} - ${targetList.name}`,
      amount: finalAmount > 0 ? finalAmount : 25.0, // sensible fallback
      category: 'Groceries',
      date: new Date().toISOString(),
      paymentMethod: 'Debit Card',
      paidByUserId: activeUser.id,
      linkedShoppingListId: targetList.id,
      notes: `Finished shopping trip (${completedItems.length}/${targetList.items.length} items acquired)`,
    });

    // Mark completed items in the list or uncheck them
    setLists(prev =>
      prev.map(l => {
        if (l.id === listId) {
          return {
            ...l,
            items: l.items.map(item => ({ ...item, isCompleted: false })),
          };
        }
        return l;
      })
    );

    return {
      totalAmount: finalAmount,
      expenseId: createdExpense.id,
    };
  };

  const resetShoppingListsToDefault = () => {
    setLists(INITIAL_SHOPPING_LISTS);
  };

  return (
    <ShoppingListContext.Provider
      value={{
        lists,
        createList,
        updateList,
        deleteList,
        addItem,
        toggleItemCompleted,
        deleteItem,
        joinListByCode,
        finishShoppingTrip,
        resetShoppingListsToDefault,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = (): ShoppingListContextType => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};
