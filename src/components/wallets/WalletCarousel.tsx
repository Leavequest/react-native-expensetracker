import React, { useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { THEME } from '../../constants';
import { makeStyles, useTheme } from '../../context';
import { Wallet } from '../../types';
import { Icon } from '../common';
import { WALLET_CARD_WIDTH, WalletCard } from './WalletCard';

const GAP = THEME.spacing.md;
const INTERVAL = WALLET_CARD_WIDTH + GAP;

interface WalletCarouselProps {
  /** The active member's non-archived wallets */
  wallets: Wallet[];
  balances: Record<string, number>;
  /** A wallet id, or 'all' */
  selectedId: string;
  onSelect: (id: string) => void;
  onEdit: (wallet: Wallet) => void;
  onAdd: () => void;
}

/** Snapping row: "All wallets", one card per wallet, then "Add wallet". */
export const WalletCarousel: React.FC<WalletCarouselProps> = ({
  wallets,
  balances,
  selectedId,
  onSelect,
  onEdit,
  onAdd,
}) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const [page, setPage] = useState(0);

  const total = Math.round(wallets.reduce((sum, w) => sum + (balances[w.id] ?? 0), 0) * 100) / 100;
  const cardCount = wallets.length + 2;

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / INTERVAL);
    setPage(Math.min(cardCount - 1, Math.max(0, index)));
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={styles.row}
        onMomentumScrollEnd={handleScrollEnd}
      >
        <WalletCard
          name="All wallets"
          balance={total}
          icon="wallet"
          color={colors.primary}
          selected={selectedId === 'all'}
          onPress={() => onSelect('all')}
        />
        {wallets.map(wallet => (
          <WalletCard
            key={wallet.id}
            name={wallet.name}
            balance={balances[wallet.id] ?? 0}
            icon={wallet.type === 'cash' ? 'money' : 'card'}
            color={wallet.color}
            selected={selectedId === wallet.id}
            onPress={() => onSelect(wallet.id)}
            onLongPress={() => onEdit(wallet)}
          />
        ))}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onAdd}
          style={styles.addCard}
          accessibilityRole="button"
          accessibilityLabel="Add wallet"
        >
          <Icon name="plus" size={20} color={colors.primary} strokeWidth={2.5} />
          <Text style={styles.addText}>Add wallet</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.dots} importantForAccessibility="no-hide-descendants">
        {Array.from({ length: cardCount }, (_, index) => (
          <View key={index} style={[styles.dot, index === page && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
};

const useStyles = makeStyles(colors => ({
  row: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    gap: GAP,
  },
  addCard: {
    width: WALLET_CARD_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primaryBorder,
    backgroundColor: colors.surfaceSubtle,
  },
  addText: {
    ...THEME.typography.captionBold,
    color: colors.primary,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    marginTop: THEME.spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceBorder,
  },
  dotActive: {
    width: 14,
    backgroundColor: colors.primary,
  },
}));
