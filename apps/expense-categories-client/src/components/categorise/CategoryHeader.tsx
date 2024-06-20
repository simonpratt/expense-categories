import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styled, { useTheme } from 'styled-components';
import { Heading } from '@dtdot/lego';

const CustomHeading = styled(Heading.SubHeading)`
  height: 40px;
  display: flex;
  align-items: center;
`;

interface CategoryHeaderProps {
  selectedCategoryName: string;
  selectedCategory: string | null;
  setEditModalOpen: (open: boolean) => void;
  onDeleteCategory: () => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  selectedCategoryName,
  selectedCategory,
  setEditModalOpen,
  onDeleteCategory,
}) => {
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
      <CustomHeading>{selectedCategoryName}</CustomHeading>
      {selectedCategory && selectedCategory !== 'all' && (
        <>
          <IconButton
            onClick={handleMenuOpen}
            style={{ marginLeft: '8px', color: theme.colours.defaultFont }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
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
