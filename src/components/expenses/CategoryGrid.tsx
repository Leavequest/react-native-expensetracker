import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EXPENSE_CATEGORIES, THEME } from '../../constants';
import { ExpenseCategory } from '../../types';
import { CategoryIcon } from '../common';

interface CategoryGridProps {
  selected: ExpenseCategory;
  onSelect: (category: ExpenseCategory) => void;
}

/** Tappable grid of every expense category (icon + name). */
export const CategoryGrid: React.FC<CategoryGridProps> = ({ selected, onSelect }) => (
  <View style={styles.grid}>
    {EXPENSE_CATEGORIES.map(cat => {
      const isSelected = cat.name === selected;
      return (
        <TouchableOpacity
          key={cat.name}
          activeOpacity={0.7}
          onPress={() => onSelect(cat.name)}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
          accessibilityLabel={cat.name}
          style={[
            styles.tile,
            isSelected && { borderColor: cat.color, backgroundColor: `${cat.color}14` },
          ]}
        >
          <CategoryIcon name={cat.icon} color={cat.color} size={36} />
          <Text
            numberOfLines={2}
            style={[styles.label, isSelected && { color: cat.color }, isSelected && styles.labelSelected]}
          >
            {cat.name}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: THEME.spacing.sm,
  },
  tile: {
    width: '19%',
    minHeight: 84,
    alignItems: 'center',
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: 2,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  label: {
    marginTop: 6,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: THEME.colors.textSecondary,
  },
  labelSelected: {
    fontWeight: '700',
  },
});
