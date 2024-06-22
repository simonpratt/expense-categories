import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styled, { useTheme } from 'styled-components';
import { Heading } from '@dtdot/lego';
import ColorSquare from '../common/ColorSquare';
import { FilterCategory } from './filterCategories';

const CustomHeading = styled(Heading.SubHeading)`
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 8px;
`;

interface CategoryHeaderProps {
  selectedCategory: FilterCategory;
  setEditModalOpen: (open: boolean) => void;
  onDeleteCategory: () => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ selectedCategory, setEditModalOpen, onDeleteCategory }) => {
  const theme = useTheme() as any;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditCategory = () => {
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleDeleteCategory = () => {
    onDeleteCategory();
    handleMenuClose();
  };

  return (
    <Box display='flex' alignItems='center' p={2}>
      <ColorSquare colorKey={selectedCategory.colour} />
      <CustomHeading>{selectedCategory.name}</CustomHeading>
      {selectedCategory.id && selectedCategory.id !== 'all' && (
        <>
          <IconButton onClick={handleMenuOpen} style={{ color: theme.colours.defaultFont }}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleEditCategory}>Edit Category</MenuItem>
            <MenuItem onClick={handleDeleteCategory}>Delete Category</MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
};

export default CategoryHeader;
