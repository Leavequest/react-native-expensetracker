export type PermissionAction =
  | 'addMember'
  | 'inviteMember'
  | 'removeMember'
  | 'editOtherProfile'
  | 'clearData'
  | 'setBudget';

export const OWNER_ONLY_CAPTION = 'Only the household owner can do this.';

/**
 * Seam for owner-only actions. Everything is allowed until a backend provides
 * real roles; screens already render the denied state so nothing changes then.
 */
export function usePermission(_action: PermissionAction): { allowed: boolean } {
  return { allowed: true };
}
