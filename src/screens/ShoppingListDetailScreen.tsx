import React, { useState, useMemo, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { GroceryAisle, ShoppingItem } from '../types';
import { getAisleInfo, GROCERY_AISLES, THEME } from '../constants';
import { useShoppingList, useUser, makeStyles, useTheme } from '../context';
import {
  Button,
  EmptyState,
  FloatingActionButton,
  Icon,
  ProgressBar,
  SwipeToDelete,
  showErrorToast,
  showSuccessToast,
  showUndoToast,
} from '../components/common';
import {
  ShoppingItemRow,
  AddItemModal,
  ShareListModal,
} from '../components/shopping';
import { ShoppingStackScreenProps } from '../navigation/types';

interface ShareHeaderButtonProps {
  onPress: () => void;
}

const ShareHeaderButton: React.FC<ShareHeaderButtonProps> = ({ onPress }) => {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.shareIconButton}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      accessibilityRole="button"
      accessibilityLabel="Share list"
    >
      <Icon name="share" size={20} color={colors.primary} />
    </TouchableOpacity>
  );
};

/** Shared enter/leave/move animation for rows, so ticking an item glides it between sections. */
const rowAnimation = {
  entering: FadeIn.duration(200),
  exiting: FadeOut.duration(150),
  layout: LinearTransition.duration(220),
};

export const ShoppingListDetailScreen: React.FC<
  ShoppingStackScreenProps<'ShoppingListDetail'>
> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const { listId } = route.params;
  const { lists, toggleItemCompleted, deleteItem, restoreItem, finishShoppingTrip } =
    useShoppingList();
  const { formatAmount } = useUser();

  const [addItemVisible, setAddItemVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [cartExpanded, setCartExpanded] = useState(false);

  const currentList = lists.find(l => l.id === listId);

  // Items still to buy, grouped by aisle in store order; ticked items go to the cart
  const { toBuyByAisle, inCart } = useMemo(() => {
    const items = currentList?.items ?? [];
    const toBuy = items.filter(i => !i.isCompleted);
    return {
      toBuyByAisle: GROCERY_AISLES.map(aisle => ({
        aisle: aisle.name as GroceryAisle,
        items: toBuy.filter(i => i.aisle === aisle.name),
      })).filter(group => group.items.length > 0),
      inCart: items.filter(i => i.isCompleted),
    };
  }, [currentList]);

  const listName = currentList?.name;
  const hasList = currentList !== undefined;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: listName ?? 'Shopping List',
      headerRight: hasList
        ? () => <ShareHeaderButton onPress={() => setShareModalVisible(true)} />
        : undefined,
    });
  }, [navigation, listName, hasList]);

  if (!currentList) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Shopping list not found.</Text>
        <Button title="Back to Lists" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const totalItems = currentList.items.length;
  const completedItems = inCart.length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const completedTotal = inCart.reduce((sum, i) => sum + (i.estimatedPrice || 0), 0);
  const totalEstimated = currentList.items.reduce(
    (sum, i) => sum + (i.estimatedPrice || 0),
    0
  );

  const handleFinishTrip = () => {
    const result = finishShoppingTrip(currentList.id);
    if (!result) {
      showErrorToast('Add an estimated price to your items to log the trip as an expense.');
      return;
    }
    showSuccessToast(
      `Recorded ${formatAmount(result.totalAmount)} for "${currentList.name}" in Expenses`
    );
  };

  const handleDeleteItem = (item: ShoppingItem) => {
    const index = currentList.items.findIndex(i => i.id === item.id);
    deleteItem(currentList.id, item.id);
    showUndoToast(`Removed "${item.name}"`, () => restoreItem(currentList.id, item, index));
  };

  const renderRow = (item: ShoppingItem) => (
    <Animated.View key={item.id} {...rowAnimation}>
      <SwipeToDelete onDelete={() => handleDeleteItem(item)}>
        <ShoppingItemRow
          item={item}
          onToggle={id => toggleItemCompleted(currentList.id, id)}
          onDelete={handleDeleteItem}
        />
      </SwipeToDelete>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Store & Progress Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.storeBadgeRow}>
            <Text style={styles.descriptionText} numberOfLines={3}>
              {currentList.description || 'No description'}
            </Text>
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

        {totalItems === 0 ? (
          <EmptyState
            icon="cart"
            title="This shopping list is empty"
            subtitle={'Tap the "+" button below to add grocery items by aisle.'}
          />
        ) : (
          <>
            {toBuyByAisle.length === 0 ? (
              <Text style={styles.allDoneText}>Everything is in the cart.</Text>
            ) : null}

            {toBuyByAisle.map(({ aisle, items }) => {
              const aisleMeta = getAisleInfo(aisle);
              return (
                <Animated.View key={aisle} style={styles.aisleGroup} layout={rowAnimation.layout}>
                  <View style={styles.aisleHeader}>
                    <Icon name={aisleMeta.icon} size={14} color={aisleMeta.color} />
                    <Text style={styles.aisleTitle}>{aisle}</Text>
                    <Text style={styles.aisleCount}>({items.length})</Text>
                  </View>
                  <View style={styles.itemsWrapper}>{items.map(renderRow)}</View>
                </Animated.View>
              );
            })}

            {inCart.length > 0 ? (
              <Animated.View style={styles.aisleGroup} layout={rowAnimation.layout}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setCartExpanded(expanded => !expanded)}
                  style={styles.cartHeader}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: cartExpanded }}
                >
                  <Icon name="cart" size={14} color={colors.primary} />
                  <Text style={[styles.aisleTitle, styles.cartTitle]}>In cart</Text>
                  <Text style={styles.aisleCount}>({inCart.length})</Text>
                  <View style={[styles.chevron, cartExpanded && styles.chevronOpen]}>
                    <Icon name="chevron-down" size={16} color={colors.textMuted} />
                  </View>
                </TouchableOpacity>
                {cartExpanded ? (
                  <View style={styles.itemsWrapper}>{inCart.map(renderRow)}</View>
                ) : null}
              </Animated.View>
            ) : null}
          </>
        )}
      </ScrollView>

      <FloatingActionButton
        onPress={() => setAddItemVisible(true)}
        accessibilityLabel="Add item"
      />

      <AddItemModal
        visible={addItemVisible}
        onClose={() => setAddItemVisible(false)}
        listId={currentList.id}
      />

      <ShareListModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        list={currentList}
      />
    </View>
  );
};

const useStyles = makeStyles(colors => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundText: {
    ...THEME.typography.titleMedium,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  shareIconButton: {
    padding: 6,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  headerCard: {
    backgroundColor: colors.surface,
    margin: THEME.spacing.lg,
    padding: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    ...THEME.shadows.card,
  },
  storeBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  descriptionText: {
    ...THEME.typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  codePill: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.sm,
  },
  codePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  progressCounter: {
    ...THEME.typography.captionBold,
    color: colors.textPrimary,
  },
  cartTotalText: {
    ...THEME.typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  progressBar: {
    marginVertical: THEME.spacing.sm,
  },
  finishBtn: {
    marginTop: THEME.spacing.md,
  },
  allDoneText: {
    ...THEME.typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
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
  aisleTitle: {
    ...THEME.typography.captionBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aisleCount: {
    ...THEME.typography.caption,
    color: colors.textMuted,
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: THEME.spacing.lg,
    gap: 6,
  },
  cartTitle: {
    color: colors.primary,
  },
  chevron: {
    marginLeft: 'auto',
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  itemsWrapper: {
    borderTopWidth: 1,
    borderColor: colors.surfaceBorder,
  },
}));
