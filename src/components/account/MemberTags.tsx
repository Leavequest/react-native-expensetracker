import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge } from '../common';
import { THEME } from '../../constants';
import { UserProfile } from '../../types';

/** "Owner", "Invited" and "Pending" tags for a household member. */
export const MemberTags: React.FC<{ member: UserProfile }> = ({ member }) => {
  const labels = [
    member.role === 'owner' ? 'Owner' : null,
    member.origin === 'invited' ? 'Invited' : null,
    member.status === 'pending' ? 'Pending' : null,
  ].filter((label): label is string => label !== null);

  if (labels.length === 0) return null;

  return (
    <View style={styles.row}>
      {labels.map(label => (
        <Badge
          key={label}
          label={label}
          size="sm"
          color={label === 'Pending' ? THEME.colors.textSecondary : undefined}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
});
