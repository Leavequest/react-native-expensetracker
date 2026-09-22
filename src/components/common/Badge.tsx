import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { THEME } from '../../constants';

interface BadgeProps {
  label: string;
  icon?: string;
  color?: string;
  backgroundColor?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  icon,
  color,
  backgroundColor,
  size = 'md',
  style,
  textStyle,
}) => {
  const isSm = size === 'sm';
  const resolvedBg =
    backgroundColor || (color ? `${color}15` : THEME.colors.primaryLight);
  const resolvedColor = color || THEME.colors.primaryDark;

  return (
    <View
      style={[
        styles.badge,
        isSm ? styles.badgeSm : styles.badgeMd,
        { backgroundColor: resolvedBg },
        style,
      ]}
    >
      {icon ? (
        <Text style={[styles.icon, isSm ? styles.iconSm : styles.iconMd]}>
          {icon}{' '}
        </Text>
      ) : null}
      <Text
        numberOfLines={1}
        style={[
          styles.text,
          isSm ? styles.textSm : styles.textMd,
          { color: resolvedColor },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: THEME.borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  icon: {
    marginRight: 2,
  },
  iconSm: {
    fontSize: 10,
  },
  iconMd: {
    fontSize: 12,
  },
  text: {
    fontWeight: '600',
  },
  textSm: {
    fontSize: 11,
  },
  textMd: {
    fontSize: 12,
  },
});
