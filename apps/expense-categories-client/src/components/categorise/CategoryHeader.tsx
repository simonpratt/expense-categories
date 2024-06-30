import React, { useState } from 'react';

import { Heading } from '@dtdot/lego';

import SettingsIcon from '@mui/icons-material/Settings';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import styled, { useTheme } from 'styled-components';

import { FilterCategory } from './filterCategories';

const CustomHeading = styled(Heading.SubHeading)`
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 8px;
`;

const Description = styled(Typography)`
  margin-left: 8px;
  color: ${(props) => (props.theme as any).colours.secondaryFont};
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
    <Box display='flex' flexDirection='column' p={2}>
      <Box display='flex' alignItems='center'>
        {selectedCategory.icon}
        <CustomHeading>{selectedCategory.name}</CustomHeading>
        {selectedCategory.id && selectedCategory.fromDatabase && (
          <>
            <IconButton onClick={handleMenuOpen} style={{ color: theme.colours.defaultFont }}>
              <SettingsIcon />
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
      {selectedCategory.description && <Description variant='body2'>{selectedCategory.description}</Description>}
    </Box>
  );
};

export default CategoryHeader;
