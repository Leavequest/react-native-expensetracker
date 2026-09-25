import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants';
import { Icon, IconName } from './Icon';

interface FloatingActionButtonProps {
  onPress: () => void;
  accessibilityLabel: string;
  icon?: IconName;
}

/** Round primary button pinned to the bottom-right corner of a screen. */
export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  accessibilityLabel,
  icon = 'plus',
}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    style={styles.button}
  >
    <Icon name={icon} size={26} color={THEME.colors.textInverse} strokeWidth={2.5} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
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
});
