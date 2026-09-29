import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { THEME } from '../../constants';
import { Icon, IconName } from './Icon';
import { makeStyles, useTheme } from '../../context';

interface ChipProps {
  label: string;
  onPress: () => void;
  icon?: IconName;
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
  selectedColor: selectedColorProp,
  style,
}) => {
  const { colors } = useTheme();
  const selectedColor = selectedColorProp ?? colors.primary;
  const styles = useStyles();

  return (
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
      {icon ? (
        <View style={styles.icon}>
          <Icon
            name={icon}
            size={14}
            color={selected ? colors.textInverse : selectedColor}
          />
        </View>
      ) : null}
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </TouchableOpacity>
  );
};

interface ChipRowProps {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
}

/** Horizontally scrolling row of chips. */
export const ChipRow: React.FC<ChipRowProps> = ({ children, contentContainerStyle }) => {
  const styles = useStyles();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.row, contentContainerStyle]}
    >
      {children}
    </ScrollView>
  );
};

const useStyles = makeStyles(colors => ({
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
    borderColor: colors.surfaceBorder,
    backgroundColor: colors.surfaceSubtle,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  textSelected: {
    color: colors.textInverse,
    fontWeight: '700',
  },
}));
