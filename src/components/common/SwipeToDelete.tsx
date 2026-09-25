import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import HapticFeedback from 'react-native-haptic-feedback';
import { THEME } from '../../constants';
import { Icon } from './Icon';

interface SwipeToDeleteProps {
  onDelete: () => void;
  children: ReactNode;
}

const DeleteAction: React.FC = () => (
  <View style={styles.action}>
    <Icon name="trash" size={20} color={THEME.colors.textInverse} />
    <Text style={styles.actionText}>Delete</Text>
  </View>
);

const renderRightActions = () => <DeleteAction />;

/**
 * Row that is deleted by swiping it to the left past the threshold.
 * Swipes aren't available to screen readers, so rows should also expose a
 * "delete" accessibility action (see `deleteAccessibilityProps`).
 */
export const SwipeToDelete: React.FC<SwipeToDeleteProps> = ({ onDelete, children }) => {
  // Only right-side actions exist, so any fully-opened swipe means "delete"
  const handleOpen = () => {
    HapticFeedback.trigger('impactMedium');
    onDelete();
  };

  return (
    <ReanimatedSwipeable
      renderRightActions={renderRightActions}
      onSwipeableOpen={handleOpen}
      rightThreshold={80}
      friction={1.5}
      overshootRight={false}
    >
      {children}
    </ReanimatedSwipeable>
  );
};

/** Accessibility props that give a row a screen-reader "Delete" action. */
export function deleteAccessibilityProps(onDelete: () => void) {
  return {
    accessibilityActions: [{ name: 'delete', label: 'Delete' }],
    onAccessibilityAction: (event: { nativeEvent: { actionName: string } }) => {
      if (event.nativeEvent.actionName === 'delete') onDelete();
    },
  };
}

const styles = StyleSheet.create({
  action: {
    width: 96,
    backgroundColor: THEME.colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  actionText: {
    ...THEME.typography.captionBold,
    color: THEME.colors.textInverse,
  },
});
