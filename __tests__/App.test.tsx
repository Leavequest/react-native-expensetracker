/**
 * @format
 */

import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

function hasText(root: ReactTestRenderer.ReactTestInstance, text: string): boolean {
  return root.findAllByType(Text).some(node => {
    const children = ([] as unknown[]).concat(node.props.children);
    return children.join('') === text;
  });
}

async function pressTab(root: ReactTestRenderer.ReactTestInstance, label: string) {
  const tab = root
    .findAllByType(TouchableOpacity)
    .find(node => node.findAllByType(Text).some(t => t.props.children === label));
  expect(tab).toBeDefined();
  await ReactTestRenderer.act(async () => {
    tab!.props.onPress();
  });
}

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

test('loads saved data and renders every tab', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  const root = renderer!.root;

  expect(hasText(root, 'Expense Tracker')).toBe(true);

  await pressTab(root, 'Shopping');
  expect(hasText(root, 'Shopping Lists')).toBe(true);

  await pressTab(root, 'Analytics');
  expect(hasText(root, 'Spending Analytics')).toBe(true);

  await pressTab(root, 'Settings');
  expect(hasText(root, 'Active Currency')).toBe(true);
  expect(hasText(root, 'Monthly Budget Limit')).toBe(true);
  expect(hasText(root, 'You')).toBe(true);
});
