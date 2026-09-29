export const LIGHT_COLORS = {
  primary: '#059669', // Emerald Green
  primaryLight: '#D1FAE5',
  primaryDark: '#065F46',
  primaryBorder: '#A7F3D0',
  accent: '#4F46E5', // Indigo
  accentLight: '#EEF2FF',
  accentDark: '#3730A3',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  surfaceBorder: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF', // Text on filled, colored backgrounds (same in both modes)
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningDark: '#92400E',
  success: '#10B981',
  successLight: '#ECFDF5',
  info: '#3B82F6',
  infoLight: '#EFF6FF',
};

export type ThemeColors = typeof LIGHT_COLORS;

// Same keys as the light palette: "Light" tints become dark tints, "Dark" shades become light ones
export const DARK_COLORS: ThemeColors = {
  primary: '#059669',
  primaryLight: '#064E3B',
  primaryDark: '#6EE7B7',
  primaryBorder: '#047857',
  accent: '#6366F1',
  accentLight: '#1E1B4B',
  accentDark: '#C7D2FE',
  background: '#0B1120',
  surface: '#151E2E',
  surfaceSubtle: '#1E293B',
  surfaceBorder: '#2A3547',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',
  danger: '#F87171',
  dangerLight: '#450A0A',
  warning: '#FBBF24',
  warningLight: '#422006',
  warningDark: '#FDE68A',
  success: '#34D399',
  successLight: '#052E16',
  info: '#60A5FA',
  infoLight: '#172554',
};

/** Colors live in ThemeContext (they change with dark mode); everything here is mode-independent */
export const THEME = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    full: 9999,
  },
  typography: {
    titleLarge: { fontSize: 26, fontWeight: '700' as const, lineHeight: 32 },
    titleMedium: { fontSize: 20, fontWeight: '700' as const, lineHeight: 26 },
    titleSmall: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
    body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    bodyMedium: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
    bodyBold: { fontSize: 14, fontWeight: '700' as const, lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
    captionBold: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
  },
  shadows: {
    card: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    floating: {
      shadowColor: '#059669',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 6,
    },
  },
};
