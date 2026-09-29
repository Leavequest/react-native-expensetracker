/**
 * @format
 */

import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

type Instance = ReactTestRenderer.ReactTestInstance;

function hasText(root: Instance, text: string): boolean {
  return root.findAllByType(Text).some(node => {
    const children = ([] as unknown[]).concat(node.props.children);
    return children.join('') === text;
  });
}

async function press(node: Instance | undefined) {
  expect(node).toBeDefined();
  await ReactTestRenderer.act(async () => {
    node!.props.onPress();
  });
}

// Deepest match wins, so a button is found rather than a pressable ancestor (e.g. a modal backdrop)
function findPressable(root: Instance, predicate: (node: Instance) => boolean) {
  const matches = root.findAll(node => typeof node.props.onPress === 'function' && predicate(node));
  return matches[matches.length - 1];
}

const findTab = (root: Instance, name: string) =>
  findPressable(root, node => node.props.testID === `tab-${name}`);

const findButtonWithText = (root: Instance, text: string) =>
  findPressable(root, node => node.findAllByType(Text).some(t => t.props.children === text));

test('loads saved data and navigates between every screen', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  const root = renderer!.root;

  expect(hasText(root, 'Wallets, income & spending')).toBe(true);
  expect(hasText(root, 'All wallets')).toBe(true);

  // Log an expense through the sheet; it shows up under "Today"
  const typeInto = async (predicate: (node: Instance) => boolean, text: string) => {
    const input = root.findAll(node => !!node.props.onChangeText && predicate(node))[0];
    expect(input).toBeDefined();
    await ReactTestRenderer.act(async () => {
      input.props.onChangeText(text);
    });
  };
  await typeInto(node => node.props.accessibilityLabel === 'Amount in EUR', '12,50');
  await typeInto(node => node.props.placeholder === 'e.g., Carrefour, Metro Pass, Dinner', 'Lunch');
  await press(findButtonWithText(root, 'Add Expense'));
  expect(hasText(root, 'Today')).toBe(true);
  expect(hasText(root, 'Lunch')).toBe(true);
  // The expense came out of the default (Cash) wallet
  expect(hasText(root, '-€ 12.50')).toBe(true);

  await press(findTab(root, 'Shopping'));
  expect(hasText(root, 'Shopping Lists')).toBe(true);

  // Joining by code needs a backend: the sheet says so and nothing can be typed or submitted
  await press(findButtonWithText(root, 'Join via Code'));
  expect(
    hasText(root, 'Joining by code is a work in progress: it needs a backend to share lists between phones.')
  ).toBe(true);
  const codeInput = root.findAll(node => node.props.accessibilityLabel === 'Share code' && node.props.onChangeText)[0];
  expect(codeInput.props.editable).toBe(false);
  expect(findButtonWithText(root, 'Join List').props.disabled).toBe(true);

  // Creating a list opens its detail screen in the Shopping stack
  await press(findButtonWithText(root, 'New List'));
  await press(findButtonWithText(root, 'Create Shopping List'));
  expect(hasText(root, 'This shopping list is empty')).toBe(true);

  // Add an item through the sheet, then tap the row to tick it into the cart
  const nameInput = root.findAll(
    node => node.props.placeholder === 'e.g. Greek Yogurt, Tomatoes, Eggs' && node.props.onChangeText
  )[0];
  await ReactTestRenderer.act(async () => {
    nameInput.props.onChangeText('Apples');
  });
  await press(findButtonWithText(root, 'Add to Shopping List'));
  expect(hasText(root, 'Apples')).toBe(true);
  expect(hasText(root, 'In cart')).toBe(false);

  await press(findPressable(root, node => node.props.accessibilityRole === 'checkbox'));
  expect(hasText(root, 'In cart')).toBe(true);
  expect(hasText(root, 'Everything is in the cart.')).toBe(true);

  await press(findTab(root, 'Analytics'));
  expect(hasText(root, 'Spending Analytics')).toBe(true);
  expect(
    root.findAll(node => node.props.accessibilityLabel?.startsWith?.('Spending by category:'))
      .length
  ).toBeGreaterThan(0);

  await press(findTab(root, 'Settings'));
  expect(hasText(root, 'Currency')).toBe(true);
  expect(hasText(root, 'Dark mode')).toBe(true);
  expect(hasText(root, 'You')).toBe(true);

  // Tabs keep their state: the Shopping tab is still on the list detail
  await press(findTab(root, 'Shopping'));
  expect(hasText(root, 'Everything is in the cart.')).toBe(true);

  await ReactTestRenderer.act(async () => {
    renderer!.unmount();
  });
// Renders the whole app, which can take longer than the 5 s default when the suite runs in parallel
}, 30000);
