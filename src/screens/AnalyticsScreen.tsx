import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header, Card } from '../components/common';
import { CategorySpendingList } from '../components/expenses';
import { THEME } from '../constants';
import { useExpense, useUser } from '../context';
import { formatMonthName, getCurrentMonthKey } from '../utils';

export const AnalyticsScreen: React.FC = () => {
  const { expenses, categoryBreakdown, totalSpentThisMonth, budget } =
    useExpense();
  const { formatAmount, currency } = useUser();

  const currentMonth = formatMonthName(getCurrentMonthKey());

  const currentMonthExpenses = useMemo(() => {
    const key = getCurrentMonthKey();
    return expenses.filter(e => e.date && e.date.startsWith(key));
  }, [expenses]);

  const groceriesSpent = useMemo(() => {
    return currentMonthExpenses
      .filter(e => e.category === 'Groceries')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [currentMonthExpenses]);

  const groceriesPercent =
    totalSpentThisMonth > 0
      ? Math.round((groceriesSpent / totalSpentThisMonth) * 100)
      : 0;

  const averageTransaction =
    currentMonthExpenses.length > 0
      ? totalSpentThisMonth / currentMonthExpenses.length
      : 0;

  return (
    <View style={styles.container}>
      <Header
        title="Spending Analytics"
        subtitle={`Insights for ${currentMonth}`}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* KPI Summary Cards */}
        <View style={styles.kpiRow}>
          <Card style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Total Spent</Text>
            <Text style={styles.kpiValue}>
              {formatAmount(totalSpentThisMonth)}
            </Text>
            <Text style={styles.kpiSub}>Currency: {currency}</Text>
          </Card>

          <Card style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Transactions</Text>
            <Text style={styles.kpiValue}>
              {currentMonthExpenses.length}
            </Text>
            <Text style={styles.kpiSub}>
              Avg: {formatAmount(averageTransaction)}
            </Text>
          </Card>
        </View>

        {/* Groceries & Supermarket Deep-dive */}
        <Card style={styles.groceriesCard}>
          <View style={styles.groceriesHeader}>
            <Text style={styles.groceriesIcon}>🛒</Text>
            <View style={styles.groceriesHeaderText}>
              <Text style={styles.groceriesTitle}>Groceries & Supermarkets</Text>
              <Text style={styles.groceriesSubtitle}>
                {groceriesPercent}% of total monthly budget spent
              </Text>
            </View>
          </View>

          <View style={styles.groceriesStatsRow}>
            <View>
              <Text style={styles.statLabel}>Grocery Spend</Text>
              <Text style={styles.statValue}>
                {formatAmount(groceriesSpent)}
              </Text>
            </View>
            <View style={styles.statRight}>
              <Text style={styles.statLabel}>Category Limit</Text>
              <Text style={styles.statValue}>
                {budget.categoryLimits?.Groceries
                  ? formatAmount(budget.categoryLimits.Groceries)
                  : 'Not set'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Category Breakdown */}
        <Text style={styles.sectionHeader}>Spending by Category</Text>
        <CategorySpendingList categories={categoryBreakdown} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  kpiRow: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    padding: THEME.spacing.md,
  },
  kpiLabel: {
    ...THEME.typography.captionBold,
    color: THEME.colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginBottom: 2,
  },
  kpiSub: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    fontSize: 11,
  },
  groceriesCard: {
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    backgroundColor: '#FFFFFF',
  },
  groceriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
    gap: 12,
  },
  groceriesIcon: {
    fontSize: 28,
  },
  groceriesHeaderText: {
    flex: 1,
  },
  groceriesTitle: {
    ...THEME.typography.titleSmall,
    color: THEME.colors.textPrimary,
  },
  groceriesSubtitle: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
  },
  groceriesStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceBorder,
  },
  statLabel: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  statRight: {
    alignItems: 'flex-end',
  },
  sectionHeader: {
    ...THEME.typography.titleSmall,
    color: THEME.colors.textPrimary,
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.xs,
  },
});
