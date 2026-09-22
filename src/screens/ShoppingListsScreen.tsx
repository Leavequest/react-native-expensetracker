import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Header, CustomModal, Button } from '../components/common';
import { ShoppingListCard, AddListModal } from '../components/shopping';
import { THEME } from '../constants';
import { useShoppingList } from '../context';
import { ShoppingListDetailScreen } from './ShoppingListDetailScreen';

export const ShoppingListsScreen: React.FC = () => {
  const { lists, deleteList, joinListByCode } = useShoppingList();

  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [addListVisible, setAddListVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');

  // If a list is selected, show detail view
  if (activeListId) {
    return (
      <ShoppingListDetailScreen
        listId={activeListId}
        onBack={() => setActiveListId(null)}
      />
    );
  }

  const handleJoin = () => {
    if (!joinCodeInput.trim()) {
      setJoinError('Please enter a share code (e.g., LIDL-4821).');
      return;
    }

    const success = joinListByCode(joinCodeInput.trim());
    if (success) {
      setJoinCodeInput('');
      setJoinError('');
      setJoinModalVisible(false);
    } else {
      setJoinError('No list found with this code. Check the code and try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Shopping Lists"
        subtitle="Shared lists & European grocery presets"
      />

      <FlatList
        data={lists}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            <View style={styles.actionsBar}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setAddListVisible(true)}
                style={styles.actionBtnPrimary}
              >
                <Text style={styles.actionBtnPrimaryIcon}>＋</Text>
                <Text style={styles.actionBtnPrimaryText}>New List</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setJoinError('');
                  setJoinModalVisible(true);
                }}
                style={styles.actionBtnSecondary}
              >
                <Text style={styles.actionBtnSecondaryIcon}>🔗</Text>
                <Text style={styles.actionBtnSecondaryText}>Join via Code</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>
              Active Lists ({lists.length})
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ShoppingListCard
            list={item}
            onPress={list => setActiveListId(list.id)}
            onDelete={deleteList}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>No shopping lists yet</Text>
            <Text style={styles.emptySubtitle}>
              Create a new shopping list or join one with a share code.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Add List Modal */}
      <AddListModal
        visible={addListVisible}
        onClose={() => setAddListVisible(false)}
        onListCreated={id => setActiveListId(id)}
      />

      {/* Join List Modal */}
      <CustomModal
        visible={joinModalVisible}
        onClose={() => setJoinModalVisible(false)}
        title="Join Shared List"
        subtitle="Enter the share code given by a flatmate or family member"
      >
        <View style={styles.joinModalContent}>
          {joinError ? <Text style={styles.errorText}>{joinError}</Text> : null}

          <Text style={styles.inputLabel}>Share Code</Text>
          <TextInput
            style={styles.joinInput}
            placeholder="e.g. LIDL-4821 or CAR-9102"
            placeholderTextColor={THEME.colors.textMuted}
            autoCapitalize="characters"
            value={joinCodeInput}
            onChangeText={t => {
              setJoinCodeInput(t);
              setJoinError('');
            }}
          />

          <View style={styles.joinActions}>
            <Button
              title="Join List"
              onPress={handleJoin}
              size="lg"
              style={styles.joinSubmitBtn}
            />
          </View>
        </View>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  listContent: {
    paddingBottom: 40,
  },
  headerSection: {
    paddingTop: THEME.spacing.md,
  },
  actionsBar: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.lg,
    gap: 12,
    marginBottom: THEME.spacing.md,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    gap: 6,
    ...THEME.shadows.card,
  },
  actionBtnPrimaryIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  actionBtnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surface,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceBorder,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    gap: 6,
  },
  actionBtnSecondaryIcon: {
    fontSize: 14,
  },
  actionBtnSecondaryText: {
    color: THEME.colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    ...THEME.typography.titleSmall,
    color: THEME.colors.textPrimary,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: THEME.spacing.xl,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    ...THEME.typography.titleSmall,
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  emptySubtitle: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
    textAlign: 'center',
  },
  joinModalContent: {
    paddingBottom: THEME.spacing.md,
  },
  errorText: {
    backgroundColor: THEME.colors.dangerLight,
    color: THEME.colors.danger,
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: THEME.spacing.md,
    fontSize: 13,
    fontWeight: '500',
  },
  inputLabel: {
    ...THEME.typography.captionBold,
    color: THEME.colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  joinInput: {
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.md,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: THEME.colors.textPrimary,
  },
  joinActions: {
    marginTop: THEME.spacing.xl,
  },
  joinSubmitBtn: {
    width: '100%',
  },
});
