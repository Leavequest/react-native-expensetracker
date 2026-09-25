import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Icon, IconName } from './Icon';

interface CategoryIconProps {
  name: IconName;
  color: string;
  /** Diameter of the tinted circle */
  size?: number;
  style?: ViewStyle;
}

/** Category/aisle icon drawn in its colour on a lightly tinted circle. */
export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, color, size = 40, style }) => (
  <View
    style={[
      styles.circle,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: `${color}1F` },
      style,
    ]}
  >
    <Icon name={name} color={color} size={Math.round(size * 0.5)} />
  </View>
);

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
