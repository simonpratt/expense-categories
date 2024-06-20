import React from 'react';
import { ControlLine, Button } from '@dtdot/lego';
import CategoryListItem from './CategoryListItem';
import { Box, List } from '@mui/material';
import { SpendingCategory } from '../../core/api.types';

interface CategoryListProps {
  categories: SpendingCategory[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  setAddModalOpen: (open: boolean) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  setAddModalOpen,
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
        />
        {categories
          ?.sort((a, b) => a.name.localeCompare(b.name))
          .map((category) => (
            <CategoryListItem
              key={category.id}
              category={category}
              selectedCategory={selectedCategory}
              onClick={() => setSelectedCategory(category.id)}
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
