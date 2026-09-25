import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { THEME } from '../../constants';

interface ChipProps {
  label: string;
  onPress: () => void;
  icon?: string;
  selected?: boolean;
  /** Background/border colour when selected (defaults to the primary colour) */
  selectedColor?: string;
  style?: ViewStyle;
}

/** Pill-shaped option used for pickers and filters. */
export const Chip: React.FC<ChipProps> = ({
  label,
  onPress,
  icon,
  selected = false,
  selectedColor = THEME.colors.primary,
  style,
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    style={[
      styles.chip,
      selected && { backgroundColor: selectedColor, borderColor: selectedColor },
      style,
    ]}
  >
    {icon ? <Text style={styles.icon}>{icon}</Text> : null}
    <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
  </TouchableOpacity>
);

interface ChipRowProps {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
}

/** Horizontally scrolling row of chips. */
export const ChipRow: React.FC<ChipRowProps> = ({ children, contentContainerStyle }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={[styles.row, contentContainerStyle]}
  >
    {children}
  </ScrollView>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  icon: {
    marginRight: 6,
    fontSize: 14,
  },
  text: {
    fontSize: 13,
    color: THEME.colors.textPrimary,
    fontWeight: '500',
  },
  textSelected: {
    color: THEME.colors.textInverse,
    fontWeight: '700',
  },
});
