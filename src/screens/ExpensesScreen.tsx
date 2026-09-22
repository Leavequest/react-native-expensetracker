import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Header } from '../components/common';
import {
  BudgetOverviewCard,
  ExpenseItemRow,
  ExpenseFormModal,
} from '../components/expenses';
import { EXPENSE_CATEGORIES, THEME } from '../constants';
import { useExpense } from '../context';
import { ExpenseCategory } from '../types';

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
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSelectedCategory('All')}
                  style={[
                    styles.filterChip,
                    selectedCategory === 'All' && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedCategory === 'All' && styles.filterChipTextActive,
                    ]}
                  >
                    All ({expenses.length})
                  </Text>
                </TouchableOpacity>

                {EXPENSE_CATEGORIES.map(cat => {
                  const count = expenses.filter(e => e.category === cat.name).length;
                  if (count === 0 && selectedCategory !== cat.name) return null;
                  const isActive = selectedCategory === cat.name;

                  return (
                    <TouchableOpacity
                      key={cat.name}
                      activeOpacity={0.7}
                      onPress={() => setSelectedCategory(cat.name)}
                      style={[
                        styles.filterChip,
                        isActive && {
                          backgroundColor: cat.color,
                          borderColor: cat.color,
                        },
                      ]}
                    >
                      <Text style={styles.filterChipIcon}>{cat.icon}</Text>
                      <Text
                        style={[
                          styles.filterChipText,
                          isActive && styles.filterChipTextActive,
                        ]}
                      >
                        {cat.name} ({count})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <ExpenseItemRow
            expense={item}
            onDelete={deleteExpense}
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
    gap: 8,
    paddingBottom: THEME.spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    backgroundColor: THEME.colors.surface,
  },
  filterChipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  filterChipIcon: {
    marginRight: 6,
    fontSize: 12,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
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
