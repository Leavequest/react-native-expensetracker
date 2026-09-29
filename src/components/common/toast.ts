import { toast } from 'sonner-native';
import { LIGHT_COLORS } from '../../constants';

const UNDO_DURATION_MS = 5000;

/** Brief confirmation that something worked. */
export function showSuccessToast(message: string): void {
  toast.success(message);
}

/** Brief explanation of why something couldn't be done. */
export function showErrorToast(message: string): void {
  toast.error(message);
}

/** Toast with an Undo button, shown after a reversible delete. */
export function showUndoToast(message: string, onUndo: () => void): void {
  const id = toast(message, {
    duration: UNDO_DURATION_MS,
    action: {
      label: 'Undo',
      onClick: () => {
        onUndo();
        toast.dismiss(id);
      },
    },
    actionButtonStyle: { backgroundColor: LIGHT_COLORS.primary },
  });
}
