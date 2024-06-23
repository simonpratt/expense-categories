import React from 'react';
import { Select, MenuItem, Box, ListItemIcon, ListItemText } from '@mui/material';
import styled from 'styled-components';
import { SpendingCategory } from '../../../core/api.types';
import { selectCategories, spendingCategoryToFilterCategory } from '../filterCategories';

const SelectNameDisplay = styled.span`
  padding-left: 16px;
`;

interface CategorySelectProps {
  categories: SpendingCategory[];
  value: string;
  onChange: (value: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ categories: dbCategories, value, onChange }) => {
  const categoryOptions = [
    ...selectCategories,
    ...dbCategories.sort((a, b) => a.name.localeCompare(b.name)).map(spendingCategoryToFilterCategory),
  ];

  return (
    <Select
      value={value || ''}
      onChange={(e) => onChange(e.target.value as string)}
      displayEmpty
      fullWidth
      renderValue={(selected) => {
        const selectedCategory = categoryOptions.find((category) => category.id === selected);
        return (
          <Box display='flex' alignItems='center'>
            {selectedCategory?.icon}
            <SelectNameDisplay>{selectedCategory?.name}</SelectNameDisplay>
          </Box>
        );
      }}
    >
      {categoryOptions.map((category) => (
        <MenuItem key={category.id} value={category.id}>
          <ListItemIcon>{category.icon}</ListItemIcon>
          <ListItemText primary={category.name} />
        </MenuItem>
      ))}
    </Select>
  );
};

export default CategorySelect;
