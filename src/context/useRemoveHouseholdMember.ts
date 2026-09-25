import { useCallback } from 'react';
import { useUser } from './UserContext';
import { useShoppingList } from './ShoppingListContext';

/**
 * Deletes a household member and cleans up their references in shopping
 * lists (collaborators and item assignments). Expenses keep `paidByUserId`
 * as a historical record.
 *
 * Returns false if the member can't be removed (the last remaining member).
 */
export function useRemoveHouseholdMember(): (userId: string) => boolean {
  const { householdUsers, deleteUser } = useUser();
  const { removeMemberFromLists } = useShoppingList();

  return useCallback(
    (userId: string) => {
      if (householdUsers.length <= 1) return false;
      deleteUser(userId);
      removeMemberFromLists(userId);
      return true;
    },
    [householdUsers.length, deleteUser, removeMemberFromLists]
  );
}
