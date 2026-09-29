import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Header,
  CustomModal,
  Button,
  EmptyState,
  FormInput,
  FormLabel,
  Icon,
} from '../components/common';
import { ShoppingListCard, AddListModal } from '../components/shopping';
import { THEME } from '../constants';
import { useShoppingList, makeStyles, useTheme } from '../context';
import { ShoppingList } from '../types';
import { ShoppingStackScreenProps } from '../navigation/types';

export const ShoppingListsScreen: React.FC<ShoppingStackScreenProps<'ShoppingLists'>> = ({
  navigation,
}) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const { lists, deleteList } = useShoppingList();

  const [addListVisible, setAddListVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);

  const openList = (listId: string) => {
    navigation.navigate('ShoppingListDetail', { listId });
  };

  const handleDeleteList = (list: ShoppingList) => {
    Alert.alert(
      'Delete shopping list?',
      `"${list.name}" and its ${list.items.length} item(s) will be permanently removed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteList(list.id) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Shopping Lists"
        subtitle="Shared lists for the household"
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
                <Icon name="plus" size={18} color={colors.textInverse} strokeWidth={2.5} />
                <Text style={styles.actionBtnPrimaryText}>New List</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setJoinModalVisible(true)}
                style={styles.actionBtnSecondary}
              >
                <Icon name="link" size={16} color={colors.textPrimary} />
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
            onPress={list => openList(list.id)}
            onDelete={handleDeleteList}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="cart"
            title="No shopping lists yet"
            subtitle="Create a new shopping list or join one with a share code."
          />
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Add List Modal */}
      <AddListModal
        visible={addListVisible}
        onClose={() => setAddListVisible(false)}
        onListCreated={openList}
      />

      {/* Join List Modal */}
      <CustomModal
        visible={joinModalVisible}
        onClose={() => setJoinModalVisible(false)}
        title="Join Shared List"
        subtitle="Enter the share code given by a flatmate or family member"
      >
        <View style={styles.joinModalContent}>
          {/* Codes only work on the phone that created the list until there is a backend to sync through */}
          <View style={styles.wipBanner}>
            <Icon name="info" size={16} color={colors.warningDark} />
            <Text style={styles.wipText}>
              Joining by code is a work in progress: it needs a backend to share lists between phones.
            </Text>
          </View>

          <FormLabel style={styles.joinLabel}>Share Code</FormLabel>
          <FormInput
            style={[styles.joinInput, styles.joinInputDisabled]}
            placeholder="e.g. WEE-4821"
            accessibilityLabel="Share code"
            editable={false}
            value=""
            onChangeText={() => {}}
          />

          <View style={styles.joinActions}>
            <Button
              title="Join List"
              onPress={() => {}}
              disabled
              size="lg"
              style={styles.joinSubmitBtn}
            />
          </View>
        </View>
      </CustomModal>
    </View>
  );
};

const useStyles = makeStyles(colors => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    gap: 6,
    ...THEME.shadows.card,
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
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    gap: 6,
  },
  actionBtnSecondaryText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    ...THEME.typography.titleSmall,
    color: colors.textPrimary,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
  },
  wipBanner: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    alignItems: 'flex-start',
    backgroundColor: colors.warningLight,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.sm,
  },
  wipText: {
    ...THEME.typography.caption,
    color: colors.warningDark,
    flex: 1,
    lineHeight: 18,
  },
  joinInputDisabled: {
    opacity: 0.5,
  },
  joinModalContent: {
    paddingBottom: THEME.spacing.md,
  },
  joinLabel: {
    marginTop: 0,
  },
  joinInput: {
    paddingVertical: THEME.spacing.md,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  joinActions: {
    marginTop: THEME.spacing.xl,
  },
  joinSubmitBtn: {
    width: '100%',
  },
}));
