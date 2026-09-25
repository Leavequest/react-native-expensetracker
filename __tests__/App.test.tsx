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

  expect(hasText(root, 'Expense Tracker')).toBe(true);

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

  await press(findTab(root, 'Shopping'));
  expect(hasText(root, 'Shopping Lists')).toBe(true);

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
  expect(hasText(root, 'Active Currency')).toBe(true);
  expect(hasText(root, 'Monthly Budget Limit')).toBe(true);
  expect(hasText(root, 'You')).toBe(true);

  // Tabs keep their state: the Shopping tab is still on the list detail
  await press(findTab(root, 'Shopping'));
  expect(hasText(root, 'Everything is in the cart.')).toBe(true);

  await ReactTestRenderer.act(async () => {
    renderer!.unmount();
  });
});
