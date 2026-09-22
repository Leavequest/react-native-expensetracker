import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Expense } from '../../types';
import { EXPENSE_CATEGORIES, THEME } from '../../constants';
import { useUser } from '../../context';
import { formatDateEuropean } from '../../utils';
import { Badge } from '../common';

interface ExpenseItemRowProps {
  expense: Expense;
  onDelete?: (id: string) => void;
  onPress?: (expense: Expense) => void;
}

export const ExpenseItemRow: React.FC<ExpenseItemRowProps> = ({
  expense,
  onDelete,
  onPress,
}) => {
  const { formatAmount } = useUser();

  const categoryMeta = EXPENSE_CATEGORIES.find(
    c => c.name === expense.category
  ) || {
    name: expense.category,
    icon: '💳',
    color: THEME.colors.primary,
  };

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={() => onPress && onPress(expense)}
      style={styles.container}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${categoryMeta.color}18` },
        ]}
      >
        <Text style={styles.iconText}>{categoryMeta.icon}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {expense.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.dateText}>
            {formatDateEuropean(expense.date)}
          </Text>
          <Text style={styles.metaDot}>•</Text>
          <Badge
            label={expense.category}
            color={categoryMeta.color}
            size="sm"
          />
        </View>
      </View>

      <View style={styles.rightContainer}>
        <Text style={styles.amountText}>
          {formatAmount(expense.amount)}
        </Text>
        <View style={styles.actionsRow}>
          <Text style={styles.paymentMethodText}>
            {expense.paymentMethod}
          </Text>
          {onDelete ? (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => onDelete(expense.id)}
              style={styles.deleteButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.deleteIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceBorder,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
  },
  iconText: {
    fontSize: 20,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...THEME.typography.titleSmall,
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
  },
  metaDot: {
    color: THEME.colors.textMuted,
    fontSize: 10,
  },
  rightContainer: {
    alignItems: 'flex-end',
    marginLeft: THEME.spacing.sm,
  },
  amountText: {
    ...THEME.typography.titleSmall,
    color: THEME.colors.textPrimary,
    fontWeight: '700',
    marginBottom: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentMethodText: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
    fontSize: 11,
  },
  deleteButton: {
    padding: 2,
  },
  deleteIcon: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontWeight: 'bold',
  },
});
