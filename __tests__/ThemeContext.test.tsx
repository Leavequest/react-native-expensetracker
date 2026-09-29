import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { DARK_COLORS, LIGHT_COLORS } from '../src/constants';
import { ThemeProvider, makeStyles, useTheme } from '../src/context/ThemeContext';
import { loadAppState } from '../src/storage/persistence';

const useStyles = makeStyles(colors => ({ box: { backgroundColor: colors.surface } }));

interface Captured {
  theme: ReturnType<typeof useTheme>;
  styles: ReturnType<typeof useStyles>;
}

const TestThemeConsumer: React.FC<{ onState: (state: Captured) => void }> = ({ onState }) => {
  const theme = useTheme();
  const styles = useStyles();
  React.useEffect(() => {
    onState({ theme, styles });
  });
  return null;
};

describe('ThemeContext', () => {
  it('toggles between light and dark, updating colors and styles', async () => {
    let captured: Captured | undefined;

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <ThemeProvider initialState={{ mode: 'light' }}>
          <TestThemeConsumer onState={s => (captured = s)} />
        </ThemeProvider>
      );
    });

    expect(captured!.theme.mode).toBe('light');
    expect(captured!.styles.box.backgroundColor).toBe(LIGHT_COLORS.surface);

    await ReactTestRenderer.act(() => {
      captured!.theme.toggleTheme();
    });

    expect(captured!.theme.isDark).toBe(true);
    expect(captured!.theme.colors).toBe(DARK_COLORS);
    expect(captured!.styles.box.backgroundColor).toBe(DARK_COLORS.surface);
  });

  it('starts from the saved mode and saves changes', async () => {
    let captured: Captured | undefined;

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <ThemeProvider initialState={{ mode: 'dark' }}>
          <TestThemeConsumer onState={s => (captured = s)} />
        </ThemeProvider>
      );
    });

    expect(captured!.theme.mode).toBe('dark');

    await ReactTestRenderer.act(async () => {
      captured!.theme.toggleTheme();
    });

    expect((await loadAppState()).theme).toEqual({ mode: 'light' });
  });

  it('falls back to the light palette outside a provider', async () => {
    let captured: Captured | undefined;

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<TestThemeConsumer onState={s => (captured = s)} />);
    });

    expect(captured!.theme.colors).toBe(LIGHT_COLORS);
  });
});
