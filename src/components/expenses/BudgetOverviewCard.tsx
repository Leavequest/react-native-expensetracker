import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, ProgressBar } from '../common';
import { THEME } from '../../constants';
import { useExpense, useUser } from '../../context';
import { formatMonthName, getCurrentMonthKey } from '../../utils';

export const BudgetOverviewCard: React.FC = () => {
  const { totalSpentThisMonth, budgetRemaining, budgetUsagePercent, budget } =
    useExpense();
  const { formatAmount } = useUser();

  const currentMonth = formatMonthName(getCurrentMonthKey());

  const getProgressColor = () => {
    if (budgetUsagePercent > 95) return THEME.colors.danger;
    if (budgetUsagePercent > 75) return THEME.colors.warning;
    return THEME.colors.primary;
  };

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.monthLabel}>{currentMonth}</Text>
          <Text style={styles.cardTitle}>Monthly Budget</Text>
        </View>
        <View style={styles.percentBadge}>
          <Text style={[styles.percentText, { color: getProgressColor() }]}>
            {budgetUsagePercent}% spent
          </Text>
        </View>
      </View>

      <View style={styles.amountRow}>
        <View>
          <Text style={styles.spentLabel}>Total Spent</Text>
          <Text style={styles.spentAmount}>
            {formatAmount(totalSpentThisMonth)}
          </Text>
        </View>
        <View style={styles.remainingBlock}>
          <Text style={styles.remainingLabel}>Remaining</Text>
          <Text
            style={[
              styles.remainingAmount,
              { color: budgetRemaining === 0 ? THEME.colors.danger : THEME.colors.primaryDark },
            ]}
          >
            {formatAmount(budgetRemaining)}
          </Text>
        </View>
      </View>

      <ProgressBar
        progress={budgetUsagePercent}
        color={getProgressColor()}
        height={10}
        style={styles.progressBar}
      />

      <View style={styles.footerRow}>
        <Text style={styles.limitText}>
          Budget Limit: <Text style={styles.limitBold}>{formatAmount(budget.totalLimit)}</Text>
        </Text>
        {budgetRemaining > 0 ? (
          <Text style={styles.statusGood}>On track</Text>
        ) : (
          <Text style={styles.statusExceeded}>Limit exceeded!</Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: THEME.spacing.lg,
    marginVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.md,
  },
  monthLabel: {
    ...THEME.typography.captionBold,
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardTitle: {
    ...THEME.typography.titleMedium,
    color: THEME.colors.textPrimary,
  },
  percentBadge: {
    backgroundColor: THEME.colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
  },
  percentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: THEME.spacing.md,
  },
  spentLabel: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
    marginBottom: 2,
  },
  spentAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  remainingBlock: {
    alignItems: 'flex-end',
  },
  remainingLabel: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
    marginBottom: 2,
  },
  remainingAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressBar: {
    marginVertical: THEME.spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: THEME.spacing.xs,
  },
  limitText: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
  },
  limitBold: {
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  statusGood: {
    ...THEME.typography.captionBold,
    color: THEME.colors.success,
  },
  statusExceeded: {
    ...THEME.typography.captionBold,
    color: THEME.colors.danger,
  },
});
