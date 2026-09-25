/* eslint-env jest */

// In-memory AsyncStorage so tests never touch native modules
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest'),
);

// Without this, SafeAreaProvider renders nothing in tests (there are no native insets to measure)
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);
