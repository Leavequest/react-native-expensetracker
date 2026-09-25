import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { GroceryAisle } from '../types';
import { GROCERY_AISLES, THEME } from '../constants';
import { useShoppingList, useUser } from '../context';
import {
  Badge,
  Button,
  ProgressBar,
} from '../components/common';
import {
  ShoppingItemRow,
  AddItemModal,
  ShareListModal,
} from '../components/shopping';

interface ShoppingListDetailScreenProps {
  listId: string;
  onBack: () => void;
}

export const ShoppingListDetailScreen: React.FC<ShoppingListDetailScreenProps> = ({
  listId,
  onBack,
}) => {
  const { lists, toggleItemCompleted, deleteItem, finishShoppingTrip } =
    useShoppingList();
  const { formatAmount } = useUser();

  const [addItemVisible, setAddItemVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [tripFinishedBanner, setTripFinishedBanner] = useState<string | null>(null);

  const currentList = lists.find(l => l.id === listId);

  // Group items by Aisle
  const groupedItems = useMemo(() => {
    if (!currentList) return {};
    const groups: Partial<Record<GroceryAisle, typeof currentList.items>> = {};

    currentList.items.forEach(item => {
      if (!groups[item.aisle]) {
        groups[item.aisle] = [];
      }
      groups[item.aisle]!.push(item);
    });

    return groups;
  }, [currentList]);

  if (!currentList) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Shopping list not found.</Text>
        <Button title="Back to Lists" onPress={onBack} />
      </View>
    );
  }

  const totalItems = currentList.items.length;
  const completedItems = currentList.items.filter(i => i.isCompleted).length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const completedTotal = currentList.items
    .filter(i => i.isCompleted)
    .reduce((sum, i) => sum + (i.estimatedPrice || 0), 0);

  const totalEstimated = currentList.items.reduce(
    (sum, i) => sum + (i.estimatedPrice || 0),
    0
  );

  const handleFinishTrip = () => {
    const result = finishShoppingTrip(currentList.id);
    if (result) {
      const msg = `Recorded expense of ${formatAmount(result.totalAmount)} at ${currentList.storeName} in your Expenses!`;
      setTripFinishedBanner(msg);
      setTimeout(() => setTripFinishedBanner(null), 5000);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>‹ Lists</Text>
        </TouchableOpacity>

        <View style={styles.topCenter}>
          <Text numberOfLines={1} style={styles.topTitle}>
            {currentList.name}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShareModalVisible(true)}
          style={styles.shareIconButton}
        >
          <Text style={styles.shareIconText}>🔗</Text>
        </TouchableOpacity>
      </View>

      {/* Success Notification Banner */}
      {tripFinishedBanner ? (
        <View style={styles.successBanner}>
          <Text style={styles.successBannerIcon}>✅</Text>
          <Text style={styles.successBannerText}>{tripFinishedBanner}</Text>
        </View>
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Store & Progress Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.storeBadgeRow}>
            <Badge
              label={currentList.storeName}
              color={currentList.color}
              backgroundColor={`${currentList.color}15`}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShareModalVisible(true)}
              style={styles.codePill}
            >
              <Text style={styles.codePillText}>Code: {currentList.shareCode}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressRow}>
            <View>
              <Text style={styles.progressCounter}>
                {completedItems} of {totalItems} items in cart
              </Text>
              <Text style={styles.cartTotalText}>
                Cart total: {formatAmount(completedTotal)} (est. {formatAmount(totalEstimated)})
              </Text>
            </View>
            <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
          </View>

          <ProgressBar
            progress={progress}
            color={currentList.color}
            height={8}
            style={styles.progressBar}
          />

          {/* Finish Shopping Button */}
          {totalItems > 0 && (
            <Button
              title={`Finish Shopping Trip (${formatAmount(completedTotal > 0 ? completedTotal : totalEstimated)})`}
              onPress={handleFinishTrip}
              variant="primary"
              size="md"
              style={styles.finishBtn}
            />
          )}
        </View>

        {/* Items Grouped by Aisle */}
        {totalItems === 0 ? (
          <View style={styles.emptyListState}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>This shopping list is empty</Text>
            <Text style={styles.emptySubtitle}>
              Tap the "+" button below to add grocery items by aisle.
            </Text>
          </View>
        ) : (
          Object.entries(groupedItems).map(([aisle, items]) => {
            const aisleName = aisle as GroceryAisle;
            const aisleMeta = GROCERY_AISLES.find(a => a.name === aisleName) || {
              icon: '📦',
              color: THEME.colors.primary,
            };

            return (
              <View key={aisle} style={styles.aisleGroup}>
                <View style={styles.aisleHeader}>
                  <Text style={styles.aisleIcon}>{aisleMeta.icon}</Text>
                  <Text style={styles.aisleTitle}>{aisleName}</Text>
                  <Text style={styles.aisleCount}>({items?.length})</Text>
                </View>

                <View style={styles.itemsWrapper}>
                  {items?.map(item => (
                    <ShoppingItemRow
                      key={item.id}
                      item={item}
                      onToggle={id => toggleItemCompleted(currentList.id, id)}
                      onDelete={id => deleteItem(currentList.id, id)}
                    />
                  ))}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Floating Add Item Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setAddItemVisible(true)}
        style={styles.floatingButton}
      >
        <Text style={styles.floatingButtonText}>＋</Text>
      </TouchableOpacity>

      {/* Add Item Modal */}
      <AddItemModal
        visible={addItemVisible}
        onClose={() => setAddItemVisible(false)}
        listId={currentList.id}
      />

      {/* Share List Modal */}
      <ShareListModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        list={currentList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundText: {
    ...THEME.typography.titleMedium,
    color: THEME.colors.textPrimary,
    marginBottom: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceBorder,
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 10,
  },
  backButtonText: {
    color: THEME.colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  topCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  topTitle: {
    ...THEME.typography.titleSmall,
    color: THEME.colors.textPrimary,
  },
  shareIconButton: {
    padding: 6,
  },
  shareIconText: {
    fontSize: 18,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.successLight,
    borderBottomWidth: 1,
    borderBottomColor: '#A7F3D0',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 10,
    gap: 8,
  },
  successBannerIcon: {
    fontSize: 16,
  },
  successBannerText: {
    flex: 1,
    color: THEME.colors.primaryDark,
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  headerCard: {
    backgroundColor: THEME.colors.surface,
    margin: THEME.spacing.lg,
    padding: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    ...THEME.shadows.card,
  },
  storeBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  codePill: {
    backgroundColor: THEME.colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.sm,
  },
  codePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  progressCounter: {
    ...THEME.typography.captionBold,
    color: THEME.colors.textPrimary,
  },
  cartTotalText: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  progressBar: {
    marginVertical: THEME.spacing.sm,
  },
  finishBtn: {
    marginTop: THEME.spacing.md,
  },
  aisleGroup: {
    marginBottom: THEME.spacing.md,
  },
  aisleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 6,
    gap: 6,
  },
  aisleIcon: {
    fontSize: 14,
  },
  aisleTitle: {
    ...THEME.typography.captionBold,
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aisleCount: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
  },
  itemsWrapper: {
    borderTopWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  emptyListState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: THEME.spacing.xl,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    ...THEME.typography.titleSmall,
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  emptySubtitle: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.floating,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '600',
  },
});
