import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { THEME } from '../../constants';
import { makeStyles, useTheme } from '../../context';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'danger':
        return styles.dangerContainer;
      case 'ghost':
        return styles.ghostContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'danger':
        return styles.dangerText;
      case 'ghost':
        return styles.ghostText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.smContainer;
      case 'lg':
        return styles.lgContainer;
      case 'md':
      default:
        return styles.mdContainer;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.baseContainer,
        getSizeStyle(),
        getContainerStyle(),
        disabled && styles.disabledContainer,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : colors.primary}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}
          <Text
            style={[
              styles.baseText,
              getTextStyle(),
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(colors => ({
  baseContainer: {
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: 6,
  },
  smContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  mdContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  lgContainer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  primaryContainer: {
    backgroundColor: colors.primary,
  },
  secondaryContainer: {
    backgroundColor: colors.primaryLight,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dangerContainer: {
    backgroundColor: colors.danger,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  disabledContainer: {
    opacity: 0.5,
  },
  baseText: {
    fontWeight: '600',
    fontSize: 14,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: colors.primaryDark,
  },
  outlineText: {
    color: colors.primary,
  },
  dangerText: {
    color: '#FFFFFF',
  },
  ghostText: {
    color: colors.textSecondary,
  },
  disabledText: {
    color: colors.textMuted,
  },
}));
