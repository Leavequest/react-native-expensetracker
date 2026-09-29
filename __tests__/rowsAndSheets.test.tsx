import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CustomModal, SwipeToDelete } from '../src/components/common';
import { LIGHT_COLORS } from '../src/constants';
import { renderWithProviders } from '../test-utils';

describe('SwipeToDelete', () => {
  async function renderRow() {
    const { root } = await renderWithProviders(
      <GestureHandlerRootView>
        <SwipeToDelete onDelete={jest.fn()}>
          <Text>Row</Text>
        </SwipeToDelete>
      </GestureHandlerRootView>
    );
    return root.findAll(node => typeof node.props.renderRightActions === 'function')[0];
  }

  it('keeps the red delete action hidden behind an opaque row while it is pressed', async () => {
    const swipeable = await renderRow();
    expect(StyleSheet.flatten(swipeable.props.childrenContainerStyle).backgroundColor).toBe(
      LIGHT_COLORS.surface
    );
  });

  it('needs a deliberate left swipe before it takes the touch away from scrolling', async () => {
    const swipeable = await renderRow();
    expect(swipeable.props.dragOffsetFromRight).toBeLessThanOrEqual(-30);
    // There are no left actions, so a rightward drift must never start a swipe
    expect(swipeable.props.dragOffsetFromLeft).toBeGreaterThan(1000);
  });
});

describe('CustomModal', () => {
  it('scrolls the focused field above the keyboard', async () => {
    const { root } = await renderWithProviders(
      <CustomModal visible onClose={jest.fn()} title="Sheet">
        <Text>Body</Text>
      </CustomModal>
    );
    expect(root.findAll(node => typeof node.props.bottomOffset === 'number').length).toBeGreaterThan(0);
  });
});
