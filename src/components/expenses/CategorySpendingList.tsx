import React from 'react';
import { View, Text } from 'react-native';
import { CategorySpending, makeStyles } from '../../context';
import { getCategoryInfo, THEME } from '../../constants';
import { useUser } from '../../context';
import { CategoryIcon, ProgressBar } from '../common';

interface CategorySpendingListProps {
  categories: CategorySpending[];
}

export const CategorySpendingList: React.FC<CategorySpendingListProps> = ({
  categories,
}) => {
  const styles = useStyles();
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

const useStyles = makeStyles(colors => ({
  container: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
  },
  itemRow: {
    backgroundColor: colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
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
    color: colors.textPrimary,
  },
  amountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amountText: {
    ...THEME.typography.bodyBold,
    color: colors.textPrimary,
  },
  percentText: {
    ...THEME.typography.captionBold,
    color: colors.textSecondary,
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
    color: colors.textMuted,
  },
  limitStatus: {
    ...THEME.typography.captionBold,
    color: colors.success,
    fontSize: 11,
  },
  limitExceeded: {
    color: colors.danger,
  },
  emptyContainer: {
    padding: THEME.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...THEME.typography.body,
    color: colors.textMuted,
  },
}));
