import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Expense } from '../../types';
import { getCategoryInfo, THEME } from '../../constants';
import { useUser, makeStyles } from '../../context';
import { CategoryIcon, deleteAccessibilityProps } from '../common';

interface ExpenseItemRowProps {
  expense: Expense;
  /** Exposed to screen readers as a "Delete" action (sighted users swipe) */
  onDelete?: (expense: Expense) => void;
  onPress?: (expense: Expense) => void;
}

export const ExpenseItemRow: React.FC<ExpenseItemRowProps> = ({
  expense,
  onDelete,
  onPress,
}) => {
  const styles = useStyles();
  const { formatAmount } = useUser();
  const categoryMeta = getCategoryInfo(expense.category);

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress ? () => onPress(expense) : undefined}
      style={styles.container}
      accessibilityLabel={`${expense.title}, ${formatAmount(expense.amount)}, ${expense.category}`}
      {...(onDelete ? deleteAccessibilityProps(() => onDelete(expense)) : {})}
    >
      <CategoryIcon
        name={categoryMeta.icon}
        color={categoryMeta.color}
        size={44}
        style={styles.categoryIcon}
      />

      <View style={styles.detailsContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {expense.title}
        </Text>
        <Text numberOfLines={1} style={[styles.categoryText, { color: categoryMeta.color }]}>
          {expense.category}
        </Text>
      </View>

      <View style={styles.rightContainer}>
        <Text style={styles.amountText}>-{formatAmount(expense.amount)}</Text>
        <Text style={styles.paymentMethodText}>{expense.paymentMethod}</Text>
      </View>
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(colors => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
    backgroundColor: colors.surface,
  },
  categoryIcon: {
    marginRight: THEME.spacing.md,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...THEME.typography.titleSmall,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  categoryText: {
    ...THEME.typography.captionBold,
  },
  rightContainer: {
    alignItems: 'flex-end',
    marginLeft: THEME.spacing.sm,
  },
  amountText: {
    ...THEME.typography.titleSmall,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: 2,
  },
  paymentMethodText: {
    ...THEME.typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
}));
