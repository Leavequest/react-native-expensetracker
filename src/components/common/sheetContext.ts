import { createContext, useContext } from 'react';

/**
 * True for components rendered inside a CustomModal bottom sheet, so inputs can
 * switch to the sheet-aware TextInput that keeps them above the keyboard.
 */
export const InsideSheetContext = createContext(false);

export const useIsInsideSheet = (): boolean => useContext(InsideSheetContext);
