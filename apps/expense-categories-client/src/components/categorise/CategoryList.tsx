import React from 'react';

import { ControlLine, Button } from '@dtdot/lego';

import { Box, List } from '@mui/material';

import { TransactionSummary } from '../../core/api.types';
import CategoryListItem from './CategoryListItem';
import { FilterCategory } from './filterCategories';

interface CategoryListProps {
  categories: FilterCategory[];
  selectedCategory: FilterCategory;
  setSelectedCategory: (category: FilterCategory) => void;
  setAddModalOpen: (open: boolean) => void;
  transactionSummaries: TransactionSummary[];
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  setAddModalOpen,
  transactionSummaries,
}) => {
  return (
    <Box width='400px' p={2}>
      <List>
        {categories.map((category) => (
          <CategoryListItem
            key={category.id}
            category={category}
            isSelected={selectedCategory.id === category.id}
            onClick={() => setSelectedCategory(category)}
            totalDebit={transactionSummaries.filter(category.filterFn).reduce((sum, tx) => sum + tx.totalDebit, 0)}
          />
        ))}
      </List>
      <ControlLine>
        <Button variant='tertiary' onClick={() => setAddModalOpen(true)}>
          Add Category
        </Button>
      </ControlLine>
    </Box>
  );
};

export default CategoryList;
