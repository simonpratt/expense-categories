import React from 'react';
import { ListItem, ListItemText, ListItemIcon, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme as useStyledTheme } from 'styled-components';
import { colorMapping } from '../../core/colorMapping';

const ColorSquare = styled('div')(({ color }) => ({
  width: 20,
  height: 20,
  backgroundColor: color,
}));

interface CategoryListItemProps {
  category: { id: string; name: string; colour: string } | null;
  selectedCategory: string | null;
  onClick: () => void;
}

const CategoryListItem: React.FC<CategoryListItemProps> = ({ category, selectedCategory, onClick }) => {
  const darkTheme = useStyledTheme() as any;
  const theme = useTheme();

  return (
    <ListItem
      onClick={onClick}
      sx={{
        'backgroundColor': selectedCategory === (category ? category.id : null) ? theme.palette.action.selected : 'inherit',
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
        'color': darkTheme.colours.defaultFont,
        'cursor': 'pointer',
      }}
    >
      <ListItemIcon>
        <ColorSquare color={category ? colorMapping[category.colour] : darkTheme.colours.cardBackground} />
      </ListItemIcon>
      <ListItemText primary={category ? category.name : 'Uncategorised'} />
    </ListItem>
  );
};

export default CategoryListItem;
