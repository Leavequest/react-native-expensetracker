import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { UserProvider, useUser } from '../src/context/UserContext';
import { useRemoveHouseholdMember } from '../src/context/useRemoveHouseholdMember';
import { ExpenseProvider, useExpense } from '../src/context/ExpenseContext';
import {
  ShoppingListProvider,
  useShoppingList,
} from '../src/context/ShoppingListContext';

const TestShoppingConsumer: React.FC<{
  onState: (state: {
    shopping: ReturnType<typeof useShoppingList>;
    expense: ReturnType<typeof useExpense>;
  }) => void;
}> = ({ onState }) => {
  const shopping = useShoppingList();
  const expense = useExpense();

  React.useEffect(() => {
    onState({ shopping, expense });
  });

  return null;
};

describe('ShoppingListContext', () => {
  it('provides empty initial shopping lists', async () => {
    let captured:
      | {
          shopping: ReturnType<typeof useShoppingList>;
          expense: ReturnType<typeof useExpense>;
        }
      | undefined;

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <UserProvider>
          <ExpenseProvider>
            <ShoppingListProvider>
              <TestShoppingConsumer onState={s => (captured = s)} />
            </ShoppingListProvider>
          </ExpenseProvider>
        </UserProvider>
      );
    });

    expect(captured).toBeDefined();
    expect(captured!.shopping.lists.length).toBe(0);
  });

  it('adds an item, toggles completion, and finishes trip recording expense', async () => {
    let captured:
      | {
          shopping: ReturnType<typeof useShoppingList>;
          expense: ReturnType<typeof useExpense>;
        }
      | undefined;

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <UserProvider>
          <ExpenseProvider>
            <ShoppingListProvider>
              <TestShoppingConsumer onState={s => (captured = s)} />
            </ShoppingListProvider>
          </ExpenseProvider>
        </UserProvider>
      );
    });

    let targetListId = '';
    await ReactTestRenderer.act(() => {
      const created = captured!.shopping.createList('Weekly Lidl Grocery Run', 'Lidl');
      targetListId = created.id;
    });

    expect(captured!.shopping.lists.length).toBe(1);
    const targetList = captured!.shopping.lists.find(l => l.id === targetListId)!;
    expect(targetList.storeName).toBe('Lidl');
    const initialExpensesCount = captured!.expense.expenses.length;

    let newItemId = '';
    await ReactTestRenderer.act(() => {
      const item = captured!.shopping.addItem(targetList.id, {
        name: 'Croissant',
        quantity: '2',
        estimatedPrice: 2.5,
        aisle: 'Bakery',
        addedByUserId: 'u1',
      });
      newItemId = item.id;
    });

    const updatedList = captured!.shopping.lists.find(l => l.id === targetList.id)!;
    expect(updatedList.items.some(i => i.id === newItemId)).toBe(true);

    // Toggle item completion
    await ReactTestRenderer.act(() => {
      captured!.shopping.toggleItemCompleted(targetList.id, newItemId);
    });

    const toggledList = captured!.shopping.lists.find(l => l.id === targetList.id)!;
    const toggledItem = toggledList.items.find(i => i.id === newItemId)!;
    expect(toggledItem.isCompleted).toBe(true);

    // Finish shopping trip
    await ReactTestRenderer.act(() => {
      captured!.shopping.finishShoppingTrip(targetList.id);
    });

    // Should have logged an expense in ExpenseContext
    expect(captured!.expense.expenses.length).toBe(initialExpensesCount + 1);
    expect(captured!.expense.expenses[0].category).toBe('Groceries');
    expect(captured!.expense.expenses[0].title).toContain(targetList.storeName);
  });
});

describe('ShoppingListContext finishShoppingTrip', () => {
  it('does not record an expense when no item has a price', async () => {
    let captured:
      | {
          shopping: ReturnType<typeof useShoppingList>;
          expense: ReturnType<typeof useExpense>;
        }
      | undefined;

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <UserProvider>
          <ExpenseProvider>
            <ShoppingListProvider>
              <TestShoppingConsumer onState={s => (captured = s)} />
            </ShoppingListProvider>
          </ExpenseProvider>
        </UserProvider>
      );
    });

    let listId = '';
    await ReactTestRenderer.act(() => {
      listId = captured!.shopping.createList('Unpriced', 'Aldi').id;
    });
    await ReactTestRenderer.act(() => {
      captured!.shopping.addItem(listId, {
        name: 'Apples',
        quantity: '1 kg',
        aisle: 'Fresh Produce',
        addedByUserId: 'u1',
      });
    });

    let result: ReturnType<ReturnType<typeof useShoppingList>['finishShoppingTrip']> =
      undefined as never;
    await ReactTestRenderer.act(() => {
      result = captured!.shopping.finishShoppingTrip(listId);
    });

    expect(result).toBeNull();
    expect(captured!.expense.expenses.length).toBe(0);
  });
});

describe('useRemoveHouseholdMember', () => {
  it('removes the member from list collaborators and unassigns their items', async () => {
    let shopping: ReturnType<typeof useShoppingList> | undefined;
    let user: ReturnType<typeof useUser> | undefined;
    let removeMember: ReturnType<typeof useRemoveHouseholdMember> | undefined;

    const Consumer = () => {
      shopping = useShoppingList();
      user = useUser();
      removeMember = useRemoveHouseholdMember();
      return null;
    };

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <UserProvider>
          <ExpenseProvider>
            <ShoppingListProvider>
              <Consumer />
            </ShoppingListProvider>
          </ExpenseProvider>
        </UserProvider>
      );
    });

    let memberId = '';
    await ReactTestRenderer.act(() => {
      memberId = user!.addUser('Giulia').id;
    });
    await ReactTestRenderer.act(() => {
      user!.setActiveUser(memberId);
    });

    let listId = '';
    await ReactTestRenderer.act(() => {
      listId = shopping!.createList('Shared', 'Coop').id;
    });
    await ReactTestRenderer.act(() => {
      shopping!.addItem(listId, {
        name: 'Bread',
        quantity: '1',
        aisle: 'Bakery',
        assignedToUserId: memberId,
        addedByUserId: memberId,
      });
    });

    let removed = false;
    await ReactTestRenderer.act(() => {
      removed = removeMember!(memberId);
    });

    const list = shopping!.lists.find(l => l.id === listId)!;
    expect(removed).toBe(true);
    expect(user!.householdUsers.some(u => u.id === memberId)).toBe(false);
    expect(list.collaboratorIds).not.toContain(memberId);
    expect(list.items[0].assignedToUserId).toBeUndefined();

    // The last remaining member can't be removed
    await ReactTestRenderer.act(() => {
      removed = removeMember!(user!.activeUser.id);
    });
    expect(removed).toBe(false);
    expect(user!.householdUsers.length).toBe(1);
  });
});
