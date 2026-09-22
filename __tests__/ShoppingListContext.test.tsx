import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { UserProvider } from '../src/context/UserContext';
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
  it('provides initial shopping lists with items and stores', async () => {
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
    expect(captured!.shopping.lists.length).toBeGreaterThan(0);
    expect(captured!.shopping.lists[0].storeName).toBe('Lidl');
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

    const targetList = captured!.shopping.lists[0];
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
