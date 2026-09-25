import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CategorySpending } from '../../context';
import { getCategoryInfo, THEME } from '../../constants';
import { useUser } from '../../context';
import { CategoryIcon, ProgressBar } from '../common';

interface CategorySpendingListProps {
  categories: CategorySpending[];
}

export const CategorySpendingList: React.FC<CategorySpendingListProps> = ({
  categories,
}) => {
  const { formatAmount } = useUser();

  if (categories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No spending recorded for this month.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {categories.map(item => {
        const meta = getCategoryInfo(item.category);

        return (
          <View key={item.category} style={styles.itemRow}>
            <View style={styles.headerRow}>
              <View style={styles.categoryInfo}>
                <CategoryIcon name={meta.icon} color={meta.color} size={28} />
                <Text style={styles.categoryName}>{item.category}</Text>
              </View>
              <View style={styles.amountInfo}>
                <Text style={styles.amountText}>{formatAmount(item.spent)}</Text>
                <Text style={styles.percentText}>{item.percentage}%</Text>
              </View>
            </View>

            <ProgressBar
              progress={item.percentage}
              color={meta.color}
              height={6}
              style={styles.progressBar}
            />

            {item.limit ? (
              <View style={styles.limitRow}>
                <Text style={styles.limitText}>
                  Limit: {formatAmount(item.limit)}
                </Text>
                <Text
                  style={[
                    styles.limitStatus,
                    item.spent > item.limit && styles.limitExceeded,
                  ]}
                >
                  {item.spent > item.limit ? 'Over limit' : 'Under limit'}
                </Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
  },
  itemRow: {
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryName: {
    ...THEME.typography.bodyBold,
    color: THEME.colors.textPrimary,
  },
  amountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amountText: {
    ...THEME.typography.bodyBold,
    color: THEME.colors.textPrimary,
  },
  percentText: {
    ...THEME.typography.captionBold,
    color: THEME.colors.textSecondary,
  },
  progressBar: {
    marginVertical: 4,
  },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  limitText: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
  },
  limitStatus: {
    ...THEME.typography.captionBold,
    color: THEME.colors.success,
    fontSize: 11,
  },
  limitExceeded: {
    color: THEME.colors.danger,
  },
  emptyContainer: {
    padding: THEME.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
  },
});
