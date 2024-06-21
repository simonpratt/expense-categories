import { TransactionSummary } from '../../core/api.types';

export interface FilterCategory {
  id: string;
  name: string;
  colour?: string;
  fromDatabase: boolean;
  filterFn: (tx: TransactionSummary) => boolean;
}

export const systemCategoryAll = {
  id: 'all',
  name: 'All',
  colour: undefined,
  fromDatabase: false,
  filterFn: () => true,
};

export const systemCategoryUncategorised = {
  id: 'uncategorised',
  name: 'Uncategorised',
  colour: 'grey',
  fromDatabase: false,
  filterFn: (tx: TransactionSummary) => !tx.spendingCategoryId && !tx.ignored,
};

export const systemCategoryIgnored = {
  id: 'ignored',
  name: 'Ignored',
  colour: 'grey',
  fromDatabase: false,
  filterFn: (tx: TransactionSummary) => tx.ignored,
};

export const systemCategories: FilterCategory[] = [
  systemCategoryAll,
  systemCategoryUncategorised,
  systemCategoryIgnored,
];
