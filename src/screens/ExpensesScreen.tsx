import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import {
  Chip,
  ChipRow,
  EmptyState,
  FloatingActionButton,
  Header,
  SwipeToDelete,
  showUndoToast,
} from '../components/common';
import {
  BudgetOverviewCard,
  ExpenseItemRow,
  ExpenseFormModal,
} from '../components/expenses';
import { EXPENSE_CATEGORIES, THEME } from '../constants';
import { useExpense, useUser, makeStyles } from '../context';
import { Expense, ExpenseCategory } from '../types';
import { groupByDay } from '../utils';

export const ExpensesScreen: React.FC = () => {
  const styles = useStyles();
  const { expenses, deleteExpense, restoreExpense } = useExpense();
  const { formatAmount } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'All'>('All');
  const [modalVisible, setModalVisible] = useState(false);

  const sections = useMemo(() => {
    const filtered =
      selectedCategory === 'All'
        ? expenses
        : expenses.filter(e => e.category === selectedCategory);
    return groupByDay(filtered).map(group => ({
      ...group,
      total: group.data.reduce((sum, e) => sum + e.amount, 0),
    }));
  }, [expenses, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<ExpenseCategory, number>> = {};
    expenses.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, [expenses]);

  const handleDeleteExpense = (expense: Expense) => {
    deleteExpense(expense.id);
    showUndoToast(`Deleted "${expense.title}"`, () => restoreExpense(expense));
  };

  return (
    <View style={styles.container}>
      <Header
        title="Expense Tracker"
        subtitle="Manage personal expenses"
      />

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
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
        renderSectionHeader={({ section }) => (
          <View style={styles.dayHeader}>
            <Text style={styles.dayTitle}>{section.title}</Text>
            <Text style={styles.dayTotal}>-{formatAmount(section.total)}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <SwipeToDelete onDelete={() => handleDeleteExpense(item)}>
            <ExpenseItemRow expense={item} onDelete={handleDeleteExpense} />
          </SwipeToDelete>
        )}
        ItemSeparatorComponent={RowSeparator}
        ListEmptyComponent={
          <EmptyState
            icon="receipt"
            title="No transactions found"
            subtitle={'Tap the "+" button below to log your first expense.'}
          />
        }
        contentContainerStyle={styles.listContent}
      />

      <FloatingActionButton
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Add expense"
      />

      <ExpenseFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const RowSeparator: React.FC = () => {
  const styles = useStyles();
  return <View style={styles.separator} />;
};

const useStyles = makeStyles(colors => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.textPrimary,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
  },
  filterRow: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.sm,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.lg,
    paddingBottom: THEME.spacing.sm,
  },
  dayTitle: {
    ...THEME.typography.captionBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayTotal: {
    ...THEME.typography.captionBold,
    color: colors.textSecondary,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.surfaceBorder,
    marginLeft: THEME.spacing.lg + 44 + THEME.spacing.md,
  },
}));
