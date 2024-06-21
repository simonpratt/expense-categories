import React from 'react';
import { ListItem, ListItemText, ListItemIcon, useTheme } from '@mui/material';
import { useTheme as useStyledTheme } from 'styled-components';
import ColorSquare from '../common/ColorSquare';
import { FilterCategory } from './filterCategories';

interface CategoryListItemProps {
  category: FilterCategory;
  isSelected: boolean;
  totalDebit?: number;
  onClick: () => void;
}

const CategoryListItem: React.FC<CategoryListItemProps> = ({ category, isSelected, totalDebit, onClick }) => {
  const darkTheme = useStyledTheme() as any;
  const theme = useTheme();

  return (
    <ListItem
      onClick={onClick}
      sx={{
        'backgroundColor': isSelected ? theme.palette.action.selected : 'inherit',
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
        'color': darkTheme.colours.defaultFont,
        'cursor': 'pointer',
      }}
    >
      <ListItemIcon>{<ColorSquare colorKey={category.colour} />}</ListItemIcon>
      <ListItemText
        primary={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span>{category ? category.name : 'Uncategorised'}</span>
            {totalDebit ? (
              <span style={{ textAlign: 'right', color: theme.palette.text.secondary }}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalDebit)}
              </span>
            ) : null}
          </div>
        }
      />
    </ListItem>
  );
};

export default CategoryListItem;
