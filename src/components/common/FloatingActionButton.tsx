import React from 'react';
import { TouchableOpacity } from 'react-native';
import { THEME } from '../../constants';
import { Icon, IconName } from './Icon';
import { makeStyles, useTheme } from '../../context';

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
}) => {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={styles.button}
    >
      <Icon name={icon} size={26} color={colors.textInverse} strokeWidth={2.5} />
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(colors => ({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.floating,
  },
}));
