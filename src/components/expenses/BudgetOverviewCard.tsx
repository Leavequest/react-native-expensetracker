import React from 'react';
import { View, Text } from 'react-native';
import { Card, ProgressBar } from '../common';
import { THEME } from '../../constants';
import { useExpense, useUser, makeStyles, useTheme } from '../../context';
import { formatMonthName, getCurrentMonthKey } from '../../utils';

export const BudgetOverviewCard: React.FC = () => {
  const { colors } = useTheme();
  const styles = useStyles();
  const { totalSpentThisMonth, budgetRemaining, budgetUsagePercent, budget } =
    useExpense();
  const { formatAmount } = useUser();

  const currentMonth = formatMonthName(getCurrentMonthKey());

  const getProgressColor = () => {
    if (budgetUsagePercent > 95) return colors.danger;
    if (budgetUsagePercent > 75) return colors.warning;
    return colors.primary;
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
            {budget.totalLimit > 0 ? `${budgetUsagePercent}% spent` : 'No budget set'}
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
              {
                color:
                  budget.totalLimit <= 0
                    ? colors.textMuted
                    : totalSpentThisMonth > budget.totalLimit
                    ? colors.danger
                    : colors.primaryDark,
              },
            ]}
          >
            {budget.totalLimit <= 0 ? '—' : formatAmount(budgetRemaining)}
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
          Budget Limit:{' '}
          <Text style={styles.limitBold}>
            {budget.totalLimit > 0 ? formatAmount(budget.totalLimit) : 'Not set'}
          </Text>
        </Text>
        {budget.totalLimit <= 0 ? (
          <Text style={styles.statusNoBudget}>No limit set</Text>
        ) : totalSpentThisMonth > budget.totalLimit ? (
          <Text style={styles.statusExceeded}>Limit exceeded!</Text>
        ) : (
          <Text style={styles.statusGood}>On track</Text>
        )}
      </View>
    </Card>
  );
};

const useStyles = makeStyles(colors => ({
  card: {
    backgroundColor: colors.surface,
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
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardTitle: {
    ...THEME.typography.titleMedium,
    color: colors.textPrimary,
  },
  percentBadge: {
    backgroundColor: colors.surfaceSubtle,
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
    color: colors.textSecondary,
    marginBottom: 2,
  },
  spentAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  remainingBlock: {
    alignItems: 'flex-end',
  },
  remainingLabel: {
    ...THEME.typography.caption,
    color: colors.textSecondary,
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
    color: colors.textSecondary,
  },
  limitBold: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusGood: {
    ...THEME.typography.captionBold,
    color: colors.success,
  },
  statusNoBudget: {
    ...THEME.typography.captionBold,
    color: colors.textMuted,
  },
  statusExceeded: {
    ...THEME.typography.captionBold,
    color: colors.danger,
  },
}));
