import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { UserProfile } from '../../types';
import { makeStyles } from '../../context';

interface AvatarProps {
  user: Pick<UserProfile, 'initials' | 'avatarColor'>;
  size?: number;
  style?: ViewStyle;
}

/** Coloured circle with a member's initials. */
export const Avatar: React.FC<AvatarProps> = ({ user, size = 32, style }) => {
  const styles = useStyles();

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: user.avatarColor,
        },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize: Math.max(8, Math.round(size * 0.38)) }]}>
        {user.initials}
      </Text>
    </View>
  );
};

const useStyles = makeStyles(colors => ({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.textInverse,
    fontWeight: '700',
  },
}));
