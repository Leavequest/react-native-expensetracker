import React from 'react';
import { Text, View } from 'react-native';
import { THEME } from '../../constants';
import { makeStyles, useExpense, useTheme, useUser } from '../../context';
import { ProgressBar } from '../common';

/** One-line household budget for the current month. */
export const BudgetBar: React.FC = () => {
  const { colors } = useTheme();
  const styles = useStyles();
  const { budget, totalSpentThisMonth } = useExpense();
  const { formatAmount } = useUser();

  if (budget.totalLimit <= 0) {
    return <Text style={styles.empty}>No monthly budget yet. Set one in Settings.</Text>;
  }

  const ratio = totalSpentThisMonth / budget.totalLimit;
  const barColor = ratio >= 1 ? colors.danger : ratio >= 0.8 ? colors.warning : colors.primary;
  const spentText = `${formatAmount(totalSpentThisMonth)} / ${formatAmount(budget.totalLimit)}`;

  return (
    <View style={styles.container} accessible accessibilityLabel={`Monthly budget, ${spentText} spent`}>
      <View style={styles.labels}>
        <Text style={styles.label}>Monthly budget</Text>
        <Text style={styles.value}>{spentText}</Text>
      </View>
      <ProgressBar progress={Math.min(1, ratio)} color={barColor} height={6} />
    </View>
  );
};

const useStyles = makeStyles(colors => ({
  container: {
    gap: 6,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    ...THEME.typography.captionBold,
    color: colors.textSecondary,
  },
  value: {
    ...THEME.typography.captionBold,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  empty: {
    ...THEME.typography.caption,
    color: colors.textMuted,
  },
}));
