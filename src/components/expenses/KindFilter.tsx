import React from 'react';
import { StyleSheet } from 'react-native';
import { THEME } from '../../constants';
import { TimelineKind } from '../../utils';
import { Chip, ChipRow } from '../common';

export type KindFilterValue = 'all' | TimelineKind;

const OPTIONS: Array<{ value: KindFilterValue; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'expense', label: 'Expenses' },
  { value: 'income', label: 'Income' },
  { value: 'transfer', label: 'Transfers' },
];

interface KindFilterProps {
  value: KindFilterValue;
  onChange: (value: KindFilterValue) => void;
}

export const KindFilter: React.FC<KindFilterProps> = ({ value, onChange }) => (
  <ChipRow contentContainerStyle={styles.row}>
    {OPTIONS.map(option => (
      <Chip
        key={option.value}
        label={option.label}
        selected={value === option.value}
        onPress={() => onChange(option.value)}
      />
    ))}
  </ChipRow>
);

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.sm,
  },
});
