import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { CustomModal } from '../src/components/common';

// The real sheet refuses to present again after `dismiss()` is called while it isn't open
const dismiss = jest.spyOn(BottomSheetModal.prototype, 'dismiss');
const present = jest.spyOn(BottomSheetModal.prototype, 'present');

beforeEach(() => jest.clearAllMocks());

async function render(visible: boolean, onClose = jest.fn()) {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <CustomModal visible={visible} onClose={onClose} title="Sheet">
        <Text>Body</Text>
      </CustomModal>
    );
  });
  const setVisible = async (next: boolean) => {
    await ReactTestRenderer.act(async () => {
      renderer!.update(
        <CustomModal visible={next} onClose={onClose} title="Sheet">
          <Text>Body</Text>
        </CustomModal>
      );
    });
  };
  // Simulates the sheet finishing its close animation (drag, backdrop, back button)
  const finishDismiss = async () => {
    const sheet = renderer!.root.findAll(node => typeof node.props.onDismiss === 'function')[0];
    await ReactTestRenderer.act(async () => {
      sheet.props.onDismiss();
    });
  };
  return { setVisible, finishDismiss };
}

describe('CustomModal', () => {
  it("doesn't dismiss a sheet that was never opened", async () => {
    await render(false);
    expect(dismiss).not.toHaveBeenCalled();
  });

  it('presents when shown and dismisses when hidden', async () => {
    const { setVisible } = await render(false);

    await setVisible(true);
    expect(present).toHaveBeenCalledTimes(1);

    await setVisible(false);
    expect(dismiss).toHaveBeenCalledTimes(1);
  });

  it("doesn't dismiss again after the sheet closed itself", async () => {
    const onClose = jest.fn();
    const { setVisible, finishDismiss } = await render(false, onClose);
    await setVisible(true);

    await finishDismiss();
    expect(onClose).toHaveBeenCalledTimes(1);
    await setVisible(false);

    expect(dismiss).not.toHaveBeenCalled();
  });
});
