import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { THEME } from '../../constants';
import { UserProfile } from '../../types';

interface AvatarProps {
  user: Pick<UserProfile, 'initials' | 'avatarColor'>;
  size?: number;
  style?: ViewStyle;
}

/** Coloured circle with a member's initials. */
export const Avatar: React.FC<AvatarProps> = ({ user, size = 32, style }) => (
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

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: THEME.colors.textInverse,
    fontWeight: '700',
  },
});
