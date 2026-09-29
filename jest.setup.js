/* eslint-env jest */

require('react-native-gesture-handler/jestSetup');

// In-memory AsyncStorage so tests never touch native modules
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest'),
);

// Without this, SafeAreaProvider renders nothing in tests (there are no native insets to measure)
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('react-native-haptic-feedback', () => ({
  __esModule: true,
  default: { trigger: jest.fn() },
  trigger: jest.fn(),
}));

// Gesture Handler's Reanimated integration reaches for the native UI runtime, which Jest doesn't have
jest.mock(
  'react-native-gesture-handler/lib/module/handlers/gestures/installUIRuntimeBindings',
  () => ({ installUIRuntimeBindings: () => {} }),
);

// Sheets render their content inline under Jest
jest.mock('@gorhom/bottom-sheet', () => require('@gorhom/bottom-sheet/mock'));

// Toasts are asserted through these mocks (`import { toast } from 'sonner-native'` in a test)
jest.mock('sonner-native', () => {
  const toast = Object.assign(jest.fn(() => 'toast-id'), {
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
  });
  return { toast, Toaster: () => null };
});

// Keyboard handling is native; the library ships plain-View/ScrollView stand-ins for Jest
jest.mock('react-native-keyboard-controller', () =>
  require('react-native-keyboard-controller/jest'),
);
