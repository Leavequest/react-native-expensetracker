import React from 'react';
import { Text, View } from 'react-native';
import { CustomModal, Icon, SettingsGroup, SettingsRow } from '../../components/common';
import { CURRENCIES, THEME } from '../../constants';
import { makeStyles, useTheme, useUser } from '../../context';
import { CurrencyCode } from '../../types';

const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

interface CurrencyPickerModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CurrencyPickerModal: React.FC<CurrencyPickerModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const { currency, setCurrency } = useUser();

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      title="Currency"
      subtitle="Used for every amount in the app"
    >
      <SettingsGroup style={styles.group}>
        {CURRENCY_CODES.map(code => {
          const config = CURRENCIES[code];
          const isSelected = code === currency;
          return (
            <SettingsRow
              key={code}
              label={config.label}
              left={
                <View style={[styles.symbol, isSelected && styles.symbolSelected]}>
                  <Text style={[styles.symbolText, isSelected && styles.symbolTextSelected]}>
                    {config.symbol}
                  </Text>
                </View>
              }
              right={
                isSelected ? (
                  <Icon name="check" size={18} color={colors.primary} strokeWidth={2.5} />
                ) : null
              }
              accessory="none"
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              onPress={() => {
                setCurrency(code);
                onClose();
              }}
            />
          );
        })}
      </SettingsGroup>
    </CustomModal>
  );
};

const useStyles = makeStyles(colors => ({
  group: {
    marginHorizontal: 0,
    marginTop: 0,
  },
  symbol: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSubtle,
  },
  symbolSelected: {
    backgroundColor: colors.primary,
  },
  symbolText: {
    ...THEME.typography.bodyBold,
    color: colors.textSecondary,
  },
  symbolTextSelected: {
    color: colors.textInverse,
  },
}));
