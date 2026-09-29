import React from 'react';
import { Text } from 'react-native';
import { SettingsGroup, SettingsRow } from '../src/components/common';
import { findByLabel, hasText, press, renderWithProviders } from '../test-utils';

describe('SettingsRow', () => {
  it('shows label, value and group copy, and calls onPress', async () => {
    const onPress = jest.fn();
    const { root } = await renderWithProviders(
      <SettingsGroup title="Money" caption="Group caption">
        <SettingsRow label="Monthly budget" value="€ 800" onPress={onPress} />
      </SettingsGroup>
    );

    expect(hasText(root, 'Money')).toBe(true);
    expect(hasText(root, 'Group caption')).toBe(true);
    expect(hasText(root, '€ 800')).toBe(true);

    await press(findByLabel(root, 'Monthly budget'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('marks a disabled row and shows why', async () => {
    const { root } = await renderWithProviders(
      <SettingsRow label="Add member" onPress={jest.fn()} disabled disabledCaption="Not allowed." />
    );

    const row = findByLabel(root, 'Add member');
    expect(row.props.disabled).toBe(true);
    expect(row.props.accessibilityState.disabled).toBe(true);
    expect(hasText(root, 'Not allowed.')).toBe(true);
  });

  it('renders tags next to the label', async () => {
    const { root } = await renderWithProviders(
      <SettingsRow label="Invite by code" tags={<Text>Soon</Text>} disabled />
    );
    expect(hasText(root, 'Soon')).toBe(true);
  });

  it('renders a custom control on the right', async () => {
    const { root } = await renderWithProviders(
      <SettingsRow label="Dark mode" right={<Text>ON</Text>} accessory="none" onPress={jest.fn()} />
    );
    expect(hasText(root, 'ON')).toBe(true);
  });
});
