import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingList } from '../../types';
import { THEME } from '../../constants';
import { useUser } from '../../context';
import { Badge, ProgressBar } from '../common';

interface ShoppingListCardProps {
  list: ShoppingList;
  onPress: (list: ShoppingList) => void;
  onDelete?: (id: string) => void;
}

export const ShoppingListCard: React.FC<ShoppingListCardProps> = ({
  list,
  onPress,
  onDelete,
}) => {
  const { formatAmount, householdUsers } = useUser();

  const totalItems = list.items.length;
  const completedItems = list.items.filter(i => i.isCompleted).length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const estimatedTotal = list.items.reduce(
    (sum, item) => sum + (item.estimatedPrice || 0),
    0
  );

  const collaborators = householdUsers.filter(u =>
    list.collaboratorIds.includes(u.id)
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(list)}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.titleArea}>
          <Text numberOfLines={1} style={styles.listName}>
            {list.name}
          </Text>
          <View style={styles.storeRow}>
            <Badge
              label={list.storeName}
              color={list.color}
              backgroundColor={`${list.color}15`}
              size="sm"
            />
            <Text style={styles.codeText}>Code: {list.shareCode}</Text>
          </View>
        </View>

        <View style={styles.rightArea}>
          <Text style={styles.estimatedTotalText}>
            {formatAmount(estimatedTotal)}
          </Text>
          <Text style={styles.estimatedLabel}>est. total</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressInfoRow}>
          <Text style={styles.progressText}>
            {completedItems} of {totalItems} items completed
          </Text>
          <Text style={styles.percentText}>{Math.round(progress)}%</Text>
        </View>
        <ProgressBar
          progress={progress}
          color={list.color}
          height={6}
          style={styles.progressBar}
        />
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.collaboratorsContainer}>
          {collaborators.map((user, idx) => (
            <View
              key={user.id}
              style={[
                styles.avatarCircle,
                idx > 0 && styles.avatarOverlap,
                { backgroundColor: user.avatarColor },
              ]}
            >
              <Text style={styles.avatarText}>{user.initials}</Text>
            </View>
          ))}
          <Text style={styles.collaboratorsLabel}>
            {collaborators.length}{' '}
            {collaborators.length === 1 ? 'member' : 'members'}
          </Text>
        </View>

        {onDelete ? (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => onDelete(list.id)}
            style={styles.deleteBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    ...THEME.shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.md,
  },
  titleArea: {
    flex: 1,
    marginRight: THEME.spacing.md,
  },
  listName: {
    ...THEME.typography.titleSmall,
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeText: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    fontSize: 11,
  },
  rightArea: {
    alignItems: 'flex-end',
  },
  estimatedTotalText: {
    ...THEME.typography.titleSmall,
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  estimatedLabel: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    fontSize: 10,
  },
  progressSection: {
    marginBottom: THEME.spacing.md,
  },
  progressInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
  },
  percentText: {
    ...THEME.typography.captionBold,
    color: THEME.colors.textSecondary,
  },
  progressBar: {
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: THEME.spacing.xs,
  },
  collaboratorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  collaboratorsLabel: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    marginLeft: 8,
    fontSize: 11,
  },
  deleteBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  deleteText: {
    ...THEME.typography.caption,
    color: THEME.colors.danger,
    fontSize: 11,
  },
});
