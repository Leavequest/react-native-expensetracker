import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingItem } from '../../types';
import { GROCERY_AISLES, THEME } from '../../constants';
import { useUser } from '../../context';
import { Avatar, Badge } from '../common';

interface ShoppingItemRowProps {
  item: ShoppingItem;
  onToggle: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
}

export const ShoppingItemRow: React.FC<ShoppingItemRowProps> = ({
  item,
  onToggle,
  onDelete,
}) => {
  const { formatAmount, householdUsers } = useUser();

  const aisleMeta = GROCERY_AISLES.find(a => a.name === item.aisle) || {
    name: item.aisle,
    icon: '📦',
    color: THEME.colors.textMuted,
  };

  const assignedUser = item.assignedToUserId
    ? householdUsers.find(u => u.id === item.assignedToUserId)
    : null;

  return (
    <View
      style={[
        styles.container,
        item.isCompleted && styles.completedContainer,
      ]}
    >
      {/* Checkbox */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onToggle(item.id)}
        style={[
          styles.checkbox,
          item.isCompleted && styles.checkboxCompleted,
        ]}
      >
        {item.isCompleted ? (
          <Text style={styles.checkmark}>✓</Text>
        ) : null}
      </TouchableOpacity>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.nameRow}>
          <Text
            style={[
              styles.name,
              item.isCompleted && styles.nameCompleted,
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          {item.quantity ? (
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityText}>{item.quantity}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.metaRow}>
          <Badge
            label={item.aisle}
            icon={aisleMeta.icon}
            color={aisleMeta.color}
            size="sm"
          />

          {assignedUser ? (
            <View style={styles.assigneeContainer}>
              <Avatar user={assignedUser} size={16} />
              <Text style={styles.assigneeName}>{assignedUser.name}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Right Column: Price & Actions */}
      <View style={styles.right}>
        {item.estimatedPrice ? (
          <Text
            style={[
              styles.price,
              item.isCompleted && styles.priceCompleted,
            ]}
          >
            {formatAmount(item.estimatedPrice)}
          </Text>
        ) : null}

        {onDelete ? (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => onDelete(item.id)}
            style={styles.deleteBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.deleteIcon}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
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
  completedContainer: {
    backgroundColor: '#F8FAFC',
    opacity: 0.75,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: THEME.colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
    backgroundColor: '#FFFFFF',
  },
  checkboxCompleted: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    ...THEME.typography.bodyBold,
    color: THEME.colors.textPrimary,
    flexShrink: 1,
  },
  nameCompleted: {
    textDecorationLine: 'line-through',
    color: THEME.colors.textMuted,
  },
  quantityBadge: {
    backgroundColor: THEME.colors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: THEME.borderRadius.sm,
  },
  quantityText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  assigneeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  assigneeName: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    fontSize: 10,
  },
  right: {
    alignItems: 'flex-end',
    marginLeft: THEME.spacing.sm,
    gap: 6,
  },
  price: {
    ...THEME.typography.captionBold,
    color: THEME.colors.textPrimary,
  },
  priceCompleted: {
    color: THEME.colors.textMuted,
    textDecorationLine: 'line-through',
  },
  deleteBtn: {
    padding: 2,
  },
  deleteIcon: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontWeight: '700',
  },
});
