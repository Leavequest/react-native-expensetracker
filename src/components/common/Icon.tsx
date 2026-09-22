import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';

export type IconName =
  | 'wallet'
  | 'cart'
  | 'chart'
  | 'settings'
  | 'plus'
  | 'check'
  | 'trash'
  | 'share'
  | 'user'
  | 'chevron-right'
  | 'close'
  | 'filter'
  | 'store'
  | 'money';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: TextStyle;
}

const GLYPH_MAP: Record<IconName, string> = {
  wallet: '💳',
  cart: '🛒',
  chart: '📊',
  settings: '⚙️',
  plus: '＋',
  check: '✓',
  trash: '🗑️',
  share: '🔗',
  user: '👤',
  'chevron-right': '›',
  close: '✕',
  filter: '⚡',
  store: '🏬',
  money: '💶',
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 18,
  color,
  style,
}) => {
  const glyph = GLYPH_MAP[name] || '•';

  return (
    <Text
      style={[
        styles.iconText,
        { fontSize: size },
        color ? { color } : undefined,
        style,
      ]}
      accessibilityRole="image"
    >
      {glyph}
    </Text>
  );
};

const styles = StyleSheet.create({
  iconText: {
    textAlign: 'center',
    includeFontPadding: false,
  },
});
