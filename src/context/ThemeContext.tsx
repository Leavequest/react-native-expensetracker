import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { Appearance, ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { DARK_COLORS, LIGHT_COLORS, ThemeColors } from '../constants';
import { PersistedThemeState, ThemeMode, saveSlice } from '../storage/persistence';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

// Defaults to light so components still render when used outside a ThemeProvider (e.g. in tests)
const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  isDark: false,
  colors: LIGHT_COLORS,
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
  /** Previously saved choice; when omitted the device's appearance setting is used */
  initialState?: PersistedThemeState;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialState }) => {
  const [mode, setMode] = useState<ThemeMode>(
    () => initialState?.mode ?? (Appearance.getColorScheme() === 'dark' ? 'dark' : 'light')
  );

  useEffect(() => {
    saveSlice('theme', { mode });
  }, [mode]);

  const toggleTheme = useCallback(() => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      colors: mode === 'dark' ? DARK_COLORS : LIGHT_COLORS,
      toggleTheme,
    }),
    [mode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}

type NamedStyles = Record<string, ViewStyle | TextStyle | ImageStyle>;

/**
 * Declares a component's styles as a function of the current palette.
 *
 *   const useStyles = makeStyles(colors => ({ box: { backgroundColor: colors.surface } }));
 *   // inside the component:
 *   const styles = useStyles();
 */
export function makeStyles<T extends NamedStyles>(
  // Same constraint as StyleSheet.create, so literals like 'row' keep their narrow types
  factory: (colors: ThemeColors) => T & NamedStyles
): () => T {
  return function useStyles() {
    const { colors } = useTheme();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
  };
}
