import React, { ReactNode } from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants';
import { makeStyles } from '../../context';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'elevated',
}) => {
  const styles = useStyles();
  const cardStyles = [
    styles.base,
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    variant === 'flat' && styles.flat,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={cardStyles}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

const useStyles = makeStyles(colors => ({
  base: {
    backgroundColor: colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
  },
  elevated: {
    ...THEME.shadows.card,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  flat: {
    backgroundColor: colors.surfaceSubtle,
  },
}));
