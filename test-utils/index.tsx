import React, { ReactElement } from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { UserProvider } from '../src/context/UserContext';
import { ExpenseProvider } from '../src/context/ExpenseContext';
import { ShoppingListProvider } from '../src/context/ShoppingListContext';
import { WalletProvider } from '../src/context/WalletContext';
import { PersistedAppState, PersistedUserState } from '../src/storage/persistence';
import { UserProfile } from '../src/types';

export type Instance = ReactTestRenderer.ReactTestInstance;

interface RenderOptions {
  state?: PersistedAppState;
  /** Wrap the UI in a provider (e.g. AccountSheetProvider) inside the data providers */
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

/** Renders `ui` inside the app's data providers, optionally starting from saved state. */
export async function renderWithProviders(ui: ReactElement, options: RenderOptions = {}) {
  const { state = {}, wrapper: Wrapper = React.Fragment } = options;
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <UserProvider initialState={state.user}>
        <ExpenseProvider initialState={state.expenses}>
          <WalletProvider initialState={state.wallets}>
            <ShoppingListProvider initialState={state.shopping}>
              <Wrapper>{ui}</Wrapper>
            </ShoppingListProvider>
          </WalletProvider>
        </ExpenseProvider>
      </UserProvider>
    );
  });
  return renderer!;
}

/** Captures the latest value of a hook so tests can read context state. */
export function createProbe<T>(useHook: () => T) {
  const ref: { current: T | undefined } = { current: undefined };
  const Probe: React.FC = () => {
    ref.current = useHook();
    return null;
  };
  return { ref, Probe };
}

export function hasText(root: Instance, text: string): boolean {
  return root.findAllByType(Text).some(node => {
    const children = ([] as unknown[]).concat(node.props.children);
    return children.join('') === text;
  });
}

// Deepest match wins, so a button is found rather than a pressable ancestor
export function findPressable(root: Instance, predicate: (node: Instance) => boolean) {
  const matches = root.findAll(node => typeof node.props.onPress === 'function' && predicate(node));
  return matches[matches.length - 1];
}

export const findByLabel = (root: Instance, label: string) =>
  findPressable(root, node => node.props.accessibilityLabel === label);

export const findButtonWithText = (root: Instance, text: string) =>
  findPressable(root, node => node.findAllByType(Text).some(t => t.props.children === text));

export async function press(node: Instance | undefined) {
  expect(node).toBeDefined();
  await ReactTestRenderer.act(async () => {
    node!.props.onPress();
  });
}

export async function typeInto(root: Instance, accessibilityLabel: string, text: string) {
  const input = root.findAll(
    node => node.props.accessibilityLabel === accessibilityLabel && !!node.props.onChangeText
  )[0];
  expect(input).toBeDefined();
  await ReactTestRenderer.act(async () => {
    input.props.onChangeText(text);
  });
}

/** A complete household member for tests. */
export const member = (
  overrides: Partial<UserProfile> & Pick<UserProfile, 'id' | 'name'>
): UserProfile => ({
  initials: overrides.name.slice(0, 2).toUpperCase(),
  avatarColor: '#059669',
  email: `${overrides.id}@example.com`,
  isCurrentUser: false,
  role: 'member',
  origin: 'local',
  status: 'active',
  ...overrides,
});

export const userState = (users: UserProfile[], activeUserId = users[0].id): PersistedUserState => ({
  users,
  activeUserId,
  currency: 'EUR',
});
