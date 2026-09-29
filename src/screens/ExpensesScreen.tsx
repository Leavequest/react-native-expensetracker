import React, { useCallback, useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import {
  EmptyState,
  FloatingActionButton,
  Header,
  SwipeToDelete,
  showUndoToast,
} from '../components/common';
import {
  BudgetBar,
  KindFilter,
  KindFilterValue,
  TimelineRow,
  TransactionFormModal,
} from '../components/expenses';
import { WalletCarousel, WalletFormModal } from '../components/wallets';
import { THEME } from '../constants';
import { makeStyles, useExpense, useUser, useWallet } from '../context';
import { Wallet } from '../types';
import {
  buildTimeline,
  groupByDay,
  resolveSelectedWallet,
  signedAmount,
  TimelineEntry,
} from '../utils';

export const ExpensesScreen: React.FC = () => {
  const styles = useStyles();
  const { expenses, deleteExpense, restoreExpense } = useExpense();
  const { activeUser, formatAmount } = useUser();
  const {
    wallets,
    incomes,
    transfers,
    balances,
    walletsOf,
    deleteIncome,
    restoreIncome,
    deleteTransfer,
    restoreTransfer,
  } = useWallet();

  const [selectedId, setSelectedId] = useState('all');
  const [kind, setKind] = useState<KindFilterValue>('all');
  const [formVisible, setFormVisible] = useState(false);
  const [walletForm, setWalletForm] = useState<{ visible: boolean; wallet: Wallet | null }>({
    visible: false,
    wallet: null,
  });

  const visibleWallets = walletsOf(activeUser.id);
  // Falls back to "All" when the selected wallet is archived or belongs to another member
  const selected = resolveSelectedWallet(selectedId, visibleWallets);

  // "All" includes archived wallets so their history stays visible
  const walletIds = useMemo(
    () =>
      selected === 'all'
        ? wallets.filter(w => w.ownerId === activeUser.id).map(w => w.id)
        : [selected],
    [selected, wallets, activeUser.id]
  );

  const sections = useMemo(
    () =>
      groupByDay(buildTimeline({ expenses, incomes, transfers }, { walletIds, kind })).map(group => ({
        ...group,
        total:
          Math.round(group.data.reduce((sum, entry) => sum + signedAmount(entry, walletIds), 0) * 100) /
          100,
      })),
    [expenses, incomes, transfers, walletIds, kind]
  );

  const walletName = useCallback(
    (id: string) => wallets.find(w => w.id === id)?.name ?? 'Unknown wallet',
    [wallets]
  );

  const handleDelete = (entry: TimelineEntry) => {
    switch (entry.kind) {
      case 'expense':
        deleteExpense(entry.id);
        showUndoToast(`Deleted "${entry.item.title}"`, () => restoreExpense(entry.item));
        break;
      case 'income':
        deleteIncome(entry.id);
        showUndoToast(`Deleted "${entry.item.title}"`, () => restoreIncome(entry.item));
        break;
      case 'transfer':
        deleteTransfer(entry.id);
        showUndoToast('Deleted transfer', () => restoreTransfer(entry.item));
        break;
    }
  };

  const formatTotal = (total: number) => (total > 0 ? `+${formatAmount(total)}` : formatAmount(total));

  return (
    <View style={styles.container}>
      <Header title="Expenses" subtitle="Wallets, income & spending" />

      <SectionList
        sections={sections}
        keyExtractor={item => `${item.kind}-${item.id}`}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <>
            <WalletCarousel
              wallets={visibleWallets}
              balances={balances}
              selectedId={selected}
              onSelect={setSelectedId}
              onEdit={wallet => setWalletForm({ visible: true, wallet })}
              onAdd={() => setWalletForm({ visible: true, wallet: null })}
            />
            <View style={styles.budget}>
              <BudgetBar />
            </View>
            <Text style={styles.sectionTitle}>Activity</Text>
            <KindFilter value={kind} onChange={setKind} />
          </>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.dayHeader}>
            {/* Uppercased here: Android cuts off text uppercased via textTransform + letterSpacing */}
            <Text style={styles.dayTitle}>{section.title.toUpperCase()}</Text>
            <Text style={styles.dayTotal}>{formatTotal(section.total)}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <SwipeToDelete onDelete={() => handleDelete(item)}>
            <TimelineRow
              entry={item}
              amount={signedAmount(item, walletIds)}
              walletName={walletName}
              onDelete={() => handleDelete(item)}
            />
          </SwipeToDelete>
        )}
        ItemSeparatorComponent={RowSeparator}
        ListEmptyComponent={
          <EmptyState
            icon="receipt"
            title="No activity yet"
            subtitle="Tap + to add an expense, income or transfer."
          />
        }
        contentContainerStyle={styles.listContent}
      />

      <FloatingActionButton onPress={() => setFormVisible(true)} accessibilityLabel="Add transaction" />

      <TransactionFormModal
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        defaultWalletId={selected === 'all' ? undefined : selected}
      />
      <WalletFormModal
        visible={walletForm.visible}
        wallet={walletForm.wallet}
        onClose={() => setWalletForm(prev => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

const RowSeparator: React.FC = () => {
  const styles = useStyles();
  return <View style={styles.separator} />;
};

const useStyles = makeStyles(colors => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 90,
  },
  budget: {
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  sectionTitle: {
    ...THEME.typography.titleSmall,
    color: colors.textPrimary,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.lg,
    paddingBottom: THEME.spacing.sm,
  },
  dayTitle: {
    ...THEME.typography.captionBold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  dayTotal: {
    ...THEME.typography.captionBold,
    color: colors.textSecondary,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.surfaceBorder,
    marginLeft: THEME.spacing.lg + 44 + THEME.spacing.md,
  },
}));
