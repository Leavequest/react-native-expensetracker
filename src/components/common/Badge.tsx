import React from 'react';
import { View, Text, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { THEME } from '../../constants';
import { Icon, IconName } from './Icon';
import { useTheme } from '../../context';

interface BadgeProps {
  label: string;
  icon?: IconName;
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
  const { colors } = useTheme();
  const isSm = size === 'sm';
  const resolvedBg =
    backgroundColor || (color ? `${color}15` : colors.primaryLight);
  const resolvedColor = color || colors.primaryDark;

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
        <View style={styles.icon}>
          <Icon name={icon} size={isSm ? 11 : 13} color={resolvedColor} />
        </View>
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
    marginRight: 4,
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
