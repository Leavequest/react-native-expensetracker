import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Chip, ChipRow, Header } from '../components/common';
import {
  BudgetOverviewCard,
  ExpenseItemRow,
  ExpenseFormModal,
} from '../components/expenses';
import { EXPENSE_CATEGORIES, THEME } from '../constants';
import { useExpense } from '../context';
import { Expense, ExpenseCategory } from '../types';

export const ExpensesScreen: React.FC = () => {
  const { expenses, deleteExpense } = useExpense();
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'All'>('All');
  const [modalVisible, setModalVisible] = useState(false);

  const filteredExpenses = useMemo(() => {
    let list = [...expenses];
    if (selectedCategory !== 'All') {
      list = list.filter(e => e.category === selectedCategory);
    }
    // Sort descending by date
    return list.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [expenses, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<ExpenseCategory, number>> = {};
    expenses.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, [expenses]);

  const handleDeleteExpense = (expense: Expense) => {
    Alert.alert('Delete expense?', `"${expense.title}" will be permanently removed.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteExpense(expense.id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Expense Tracker"
        subtitle="Manage personal expenses"
      />

      <FlatList
        data={filteredExpenses}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <BudgetOverviewCard />

            {/* Category Filter Chips */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <ChipRow contentContainerStyle={styles.filterRow}>
                <Chip
                  label={`All (${expenses.length})`}
                  selected={selectedCategory === 'All'}
                  onPress={() => setSelectedCategory('All')}
                />

                {EXPENSE_CATEGORIES.map(cat => {
                  const count = categoryCounts[cat.name] || 0;
                  if (count === 0 && selectedCategory !== cat.name) return null;

                  return (
                    <Chip
                      key={cat.name}
                      label={`${cat.name} (${count})`}
                      icon={cat.icon}
                      selected={selectedCategory === cat.name}
                      selectedColor={cat.color}
                      onPress={() => setSelectedCategory(cat.name)}
                    />
                  );
                })}
              </ChipRow>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <ExpenseItemRow
            expense={item}
            onDelete={handleDeleteExpense}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💳</Text>
            <Text style={styles.emptyTitle}>No transactions found</Text>
            <Text style={styles.emptySubtitle}>
              Tap the "+" button below to log your first expense.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Floating Add Expense Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
        style={styles.floatingButton}
      >
        <Text style={styles.floatingButtonText}>＋</Text>
      </TouchableOpacity>

      <ExpenseFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  listContent: {
    paddingBottom: 90,
  },
  filterSection: {
    marginTop: THEME.spacing.sm,
    marginBottom: THEME.spacing.xs,
  },
  sectionTitle: {
    ...THEME.typography.titleSmall,
    color: THEME.colors.textPrimary,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
  },
  filterRow: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: THEME.spacing.xl,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    ...THEME.typography.titleSmall,
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  emptySubtitle: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.floating,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '600',
  },
});
