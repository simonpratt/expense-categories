import React from 'react';
import { ControlLine, Button } from '@dtdot/lego';
import CategoryListItem from './CategoryListItem';
import { Box, List } from '@mui/material';
import { SpendingCategory, TransactionSummary } from '../../core/api.types';

interface CategoryListProps {
  categories: SpendingCategory[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
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
        <CategoryListItem
          category={{ id: 'all', name: 'All', colour: null }}
          selectedCategory={selectedCategory}
          onClick={() => setSelectedCategory('all')}
        />
        <CategoryListItem
          category={{ id: null, name: 'Uncategorised', colour: 'grey' }}
          selectedCategory={selectedCategory}
          onClick={() => setSelectedCategory(null)}
          totalDebit={transactionSummaries
            .filter((tx) => tx.spendingCategoryId === null)
            .reduce((sum, tx) => sum + tx.totalDebit, 0)}
        />
        {categories
          ?.sort((a, b) => a.name.localeCompare(b.name))
          .map((category) => (
            <CategoryListItem
              key={category.id}
              category={category}
              selectedCategory={selectedCategory}
              onClick={() => setSelectedCategory(category.id)}
              totalDebit={transactionSummaries
                .filter((tx) => tx.spendingCategoryId === category.id)
                .reduce((sum, tx) => sum + tx.totalDebit, 0)}
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
