import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import HapticFeedback from 'react-native-haptic-feedback';
import { ShoppingItem } from '../../types';
import { getAisleInfo, THEME } from '../../constants';
import { useUser, makeStyles, useTheme } from '../../context';
import { Avatar, Badge, Icon, deleteAccessibilityProps } from '../common';

interface ShoppingItemRowProps {
  item: ShoppingItem;
  onToggle: (itemId: string) => void;
  /** Exposed to screen readers as a "Delete" action (sighted users swipe) */
  onDelete?: (item: ShoppingItem) => void;
}

const CheckBox: React.FC<{ checked: boolean }> = ({ checked }) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const progress = useSharedValue(checked ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: 180 });
    if (checked) {
      scale.value = withSequence(withTiming(0.8, { duration: 80 }), withSpring(1));
    }
  }, [checked, progress, scale]);

  const boxStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.surface, colors.primary]
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.surfaceBorder, colors.primary]
    ),
    transform: [{ scale: scale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <Animated.View style={[styles.checkbox, boxStyle]}>
      <Animated.View style={checkStyle}>
        <Icon name="check" size={16} color={colors.textInverse} strokeWidth={3} />
      </Animated.View>
    </Animated.View>
  );
};

export const ShoppingItemRow: React.FC<ShoppingItemRowProps> = ({
  item,
  onToggle,
  onDelete,
}) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const { formatAmount, householdUsers } = useUser();

  const aisleMeta = getAisleInfo(item.aisle);
  const assignedUser = item.assignedToUserId
    ? householdUsers.find(u => u.id === item.assignedToUserId)
    : null;

  const handleToggle = () => {
    HapticFeedback.trigger(item.isCompleted ? 'selection' : 'impactLight');
    onToggle(item.id);
  };

  return (
    <Pressable
      onPress={handleToggle}
      android_ripple={{ color: colors.surfaceSubtle }}
      style={({ pressed }) => [
        styles.container,
        item.isCompleted && styles.completedContainer,
        pressed && styles.pressed,
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: item.isCompleted }}
      accessibilityLabel={`${item.name}, ${item.quantity}`}
      {...(onDelete ? deleteAccessibilityProps(() => onDelete(item)) : {})}
    >
      <CheckBox checked={item.isCompleted} />

      <View style={styles.details}>
        <View style={styles.nameRow}>
          <Text
            style={[styles.name, item.isCompleted && styles.nameCompleted]}
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
          <Badge label={item.aisle} icon={aisleMeta.icon} color={aisleMeta.color} size="sm" />

          {assignedUser ? (
            <View style={styles.assigneeContainer}>
              <Avatar user={assignedUser} size={16} />
              <Text style={styles.assigneeName}>{assignedUser.name}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {item.estimatedPrice ? (
        <Text style={[styles.price, item.isCompleted && styles.priceCompleted]}>
          {formatAmount(item.estimatedPrice)}
        </Text>
      ) : null}
    </Pressable>
  );
};

const useStyles = makeStyles(colors => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  completedContainer: {
    backgroundColor: colors.background,
  },
  pressed: {
    opacity: 0.85,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
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
    color: colors.textPrimary,
    flexShrink: 1,
  },
  nameCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  quantityBadge: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: THEME.borderRadius.sm,
  },
  quantityText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
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
    color: colors.textMuted,
    fontSize: 10,
  },
  price: {
    ...THEME.typography.captionBold,
    color: colors.textPrimary,
    marginLeft: THEME.spacing.sm,
  },
  priceCompleted: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
}));
