import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { ExpenseProvider, useExpense } from '../src/context/ExpenseContext';

const TestExpenseConsumer: React.FC<{
  onState: (state: ReturnType<typeof useExpense>) => void;
}> = ({ onState }) => {
  const expenseState = useExpense();
  React.useEffect(() => {
    onState(expenseState);
  });
  return null;
};

describe('ExpenseContext', () => {
  it('provides initial expenses and budget values', async () => {
    let capturedState: ReturnType<typeof useExpense> | undefined;

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <ExpenseProvider>
          <TestExpenseConsumer
            onState={state => {
              capturedState = state;
            }}
          />
        </ExpenseProvider>
      );
    });

    expect(capturedState).toBeDefined();
    expect(capturedState!.expenses.length).toBe(0);
    expect(capturedState!.budget.totalLimit).toBe(0);
    expect(capturedState!.budgetRemaining).toBe(0);
  });

  it('allows adding and deleting an expense', async () => {
    let capturedState: ReturnType<typeof useExpense> | undefined;

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <ExpenseProvider>
          <TestExpenseConsumer
            onState={state => {
              capturedState = state;
            }}
          />
        </ExpenseProvider>
      );
    });

    const initialCount = capturedState!.expenses.length;

    let createdId = '';
    await ReactTestRenderer.act(() => {
      const newExp = capturedState!.addExpense({
        title: 'Test Supermarket',
        amount: 50.0,
        category: 'Groceries',
        paymentMethod: 'Debit Card',
        date: new Date().toISOString(),
        paidByUserId: 'u1',
      });
      createdId = newExp.id;
    });

    expect(capturedState!.expenses.length).toBe(initialCount + 1);
    expect(capturedState!.expenses[0].title).toBe('Test Supermarket');

    await ReactTestRenderer.act(() => {
      capturedState!.deleteExpense(createdId);
    });

    expect(capturedState!.expenses.length).toBe(initialCount);
  });
});
