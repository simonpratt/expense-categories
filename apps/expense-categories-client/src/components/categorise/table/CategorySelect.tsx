import React from 'react';
import { Select, MenuItem, Box, ListItemIcon, ListItemText } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';
import { SpendingCategory } from '../../../core/api.types';
import ColorSquare from '../../common/ColorSquare';

const SelectNameDisplay = styled.span`
  padding-left: 16px;
`;

interface CategorySelectProps {
  categories: SpendingCategory[];
  value: string;
  onChange: (value: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ categories, value, onChange }) => {
  const theme = useTheme();

  return (
    <Select
      value={value || ''}
      onChange={(e) => onChange(e.target.value as string)}
      displayEmpty
      fullWidth
      renderValue={(selected) => {
        const selectedCategory = categories.find((category) => category.id === selected);
        return (
          <Box display='flex' alignItems='center'>
            <ColorSquare colorKey={selectedCategory?.colour} />
            <SelectNameDisplay>
              {selectedCategory ? selectedCategory.name : 'Uncategorised'}
            </SelectNameDisplay>
          </Box>
        );
      }}
    >
      <MenuItem value='ignore'>
        <ListItemIcon>
          <Visibility style={{ color: theme.palette.text.primary }} />
        </ListItemIcon>
        <ListItemText primary='Ignore' />
      </MenuItem>
      <MenuItem value=''>
        <ListItemIcon>
          <ColorSquare colorKey={'grey'} />
        </ListItemIcon>
        <ListItemText primary='Uncategorised' />
      </MenuItem>
      {categories.map((category) => (
        <MenuItem key={category.id} value={category.id}>
          <ListItemIcon>
            <ColorSquare colorKey={category.colour} />
          </ListItemIcon>
          <ListItemText primary={category.name} />
        </MenuItem>
      ))}
    </Select>
  );
};

export default CategorySelect;
