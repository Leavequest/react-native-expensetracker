import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { getCategoryInfo, THEME } from '../../constants';
import { CategorySpending, useUser } from '../../context';

interface SpendingDonutProps {
  categories: CategorySpending[];
  total: number;
}

/** Donut of this month's spending per category, with the total in the middle. */
export const SpendingDonut: React.FC<SpendingDonutProps> = ({ categories, total }) => {
  const { formatAmount } = useUser();

  const data = categories.map(c => ({
    value: c.spent,
    color: getCategoryInfo(c.category).color,
  }));

  const renderCenterLabel = useCallback(
    () => (
      <View style={styles.center}>
        <Text style={styles.centerLabel}>Total</Text>
        <Text style={styles.centerValue} numberOfLines={1} adjustsFontSizeToFit>
          {formatAmount(total)}
        </Text>
      </View>
    ),
    [formatAmount, total]
  );

  const summary = categories
    .map(c => `${c.category} ${c.percentage}%`)
    .join(', ');

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Spending by category: ${summary}. Total ${formatAmount(total)}.`}
    >
      <PieChart
        data={data}
        donut
        radius={96}
        innerRadius={66}
        innerCircleColor={THEME.colors.surface}
        strokeWidth={2}
        strokeColor={THEME.colors.surface}
        centerLabelComponent={renderCenterLabel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
  },
  center: {
    alignItems: 'center',
    width: 110,
  },
  centerLabel: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
  },
  centerValue: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
});
