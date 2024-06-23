import React from 'react';
import { SpendingCategory, TransactionSummary } from '../../core/api.types';
import ColorSquare from '../common/ColorSquare';
import { VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const WhiteVisibilityOff = () => {
  const theme = useTheme();

  return <VisibilityOff style={{ color: theme.palette.text.primary }} />;
};

export interface FilterCategory {
  id: string;
  name: string;
  description?: string;
  icon?: React.ReactNode;
  fromDatabase: boolean;
  filterFn: (tx: TransactionSummary) => boolean;
}

export const systemCategoryAll = {
  id: 'all',
  name: 'All',
  icon: <ColorSquare />,
  fromDatabase: false,
  filterFn: () => true,
};

export const systemCategoryUncategorised = {
  id: 'uncategorised',
  name: 'Uncategorised',
  icon: <ColorSquare colorKey='grey' />,
  fromDatabase: false,
  filterFn: (tx: TransactionSummary) => !tx.spendingCategoryId && !tx.ignored,
};

export const systemCategoryIgnored = {
  id: 'ignored',
  name: 'Ignored',
  icon: <WhiteVisibilityOff />,
  fromDatabase: false,
  filterFn: (tx: TransactionSummary) => tx.ignored,
};

export const spendingCategoryToFilterCategory = (category: SpendingCategory): FilterCategory => ({
  ...category,
  description: category.description || undefined,
  icon: <ColorSquare colorKey={category.colour} />,
  fromDatabase: true,
  filterFn: (tx: TransactionSummary) => tx.spendingCategoryId === category.id,
});

export const systemCategories: FilterCategory[] = [
  systemCategoryAll,
  systemCategoryIgnored,
  systemCategoryUncategorised,
];

export const selectCategories: FilterCategory[] = [systemCategoryIgnored, systemCategoryUncategorised];
