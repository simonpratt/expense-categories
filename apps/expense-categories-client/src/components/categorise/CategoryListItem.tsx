import React from 'react';
import { ListItem, ListItemText, ListItemIcon, useTheme } from '@mui/material';
import { useTheme as useStyledTheme } from 'styled-components';
import ColorSquare from '../common/ColorSquare';

interface CategoryListItemProps {
  category: { id: string | null; name: string; colour: string | null };
  selectedCategory: string | null;
  totalDebit?: number;
  onClick: () => void;
}

const CategoryListItem: React.FC<CategoryListItemProps> = ({ category, selectedCategory, totalDebit, onClick }) => {
  const darkTheme = useStyledTheme() as any;
  const theme = useTheme();

  return (
    <ListItem
      onClick={onClick}
      sx={{
        'backgroundColor':
          selectedCategory === (category ? category.id : null) ? theme.palette.action.selected : 'inherit',
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
