module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  // Lets Reanimated/Worklets run their JS (web) implementation under Jest
  resolver: 'react-native-reanimated/jest/resolver',
  // Lucide resolves to .mjs builds under Jest; use its CommonJS builds instead
  moduleNameMapper: {
    '^lucide-react-native/icons/(.*)$':
      '<rootDir>/node_modules/lucide-react-native/dist/cjs/icons/$1.js',
  },
  // These packages ship untranspiled ESM, so they must be transformed like react-native itself
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native(-[a-z-]+)?|@react-native(-community)?|@react-native-async-storage|@react-navigation|@gorhom|sonner-native|gifted-charts-core)/)',
  ],
};
