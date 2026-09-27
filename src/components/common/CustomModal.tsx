import React, { ReactNode, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../../constants';
import { Icon } from './Icon';
import { InsideSheetContext } from './sheetContext';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Called after the sheet has fully closed, however it was closed (e.g. to navigate afterwards) */
  onDismissed?: () => void;
}

const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...props}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
    pressBehavior="close"
    opacity={0.45}
  />
);

/**
 * Bottom sheet with a title bar. Sizes itself to its content, scrolls when taller
 * than the screen, closes on drag-down / backdrop tap, and keeps inputs above the keyboard.
 */
export const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  onDismissed,
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  // Calling dismiss() on a sheet that isn't open leaves it stuck "dismissing",
  // and the library then ignores every later present()
  const isOpen = useRef(false);

  useEffect(() => {
    if (visible) {
      isOpen.current = true;
      sheetRef.current?.present();
    } else if (isOpen.current) {
      isOpen.current = false;
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  // Fires for every way the sheet can close (drag, backdrop, back button, programmatic)
  const handleDismiss = useCallback(() => {
    isOpen.current = false;
    if (visible) onClose();
    onDismissed?.();
  }, [visible, onClose, onDismissed]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      onDismiss={handleDismiss}
      enableDynamicSizing
      maxDynamicContentSize={windowHeight * 0.9}
      topInset={insets.top}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, THEME.spacing.lg) + THEME.spacing.sm },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Icon name="close" size={16} color={THEME.colors.textSecondary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <InsideSheetContext.Provider value={true}>{children}</InsideSheetContext.Provider>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: THEME.borderRadius.xl,
    borderTopRightRadius: THEME.borderRadius.xl,
  },
  handleIndicator: {
    backgroundColor: THEME.colors.surfaceBorder,
    width: 40,
  },
  content: {
    paddingHorizontal: THEME.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceBorder,
    marginBottom: THEME.spacing.lg,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...THEME.typography.titleMedium,
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    ...THEME.typography.caption,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
