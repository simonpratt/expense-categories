import React from 'react';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
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
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  selectedCategoryName,
  selectedCategory,
  setEditModalOpen,
}) => {
  const theme = useTheme() as any;

  return (
    <Box display='flex' alignItems='center' p={2}>
      <CustomHeading>{selectedCategoryName}</CustomHeading>
      {selectedCategory && selectedCategory !== 'all' && (
        <IconButton
          onClick={() => setEditModalOpen(true)}
          style={{ marginLeft: '8px', color: theme.colours.defaultFont }}
        >
          <EditIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default CategoryHeader;
