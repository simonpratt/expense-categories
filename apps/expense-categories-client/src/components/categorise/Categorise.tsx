import React, { useState } from 'react';
import { apiConnector } from '../../core/api.connector';
import { useTheme as useStyledTheme } from 'styled-components';
import { Table } from '@dtdot/lego';
import { Box, Button, List, ListItem, ListItemText, ListItemIcon, Typography, useTheme } from '@mui/material';
import AddCategoryModal from '../modals/AddCategoryModal';
import { Add as AddIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import { colorMapping } from '../../core/colorMapping';

const Categorise = () => {
  const { data: transactionSummaries } = apiConnector.app.transactions.getSummary.useQuery();
  const { data: categories } = apiConnector.app.categories.getCategories.useQuery();
  const [isAddCategoryModalOpen, setAddCategoryModalOpen] = useState(false);

  const handleOpenAddCategoryModal = () => {
    setAddCategoryModalOpen(true);
  };

  const handleCloseAddCategoryModal = () => {
    setAddCategoryModalOpen(false);
  };

  const darkTheme = useStyledTheme() as any;
  const theme = useTheme();

  const ColorSquare = styled('div')(({ color }) => ({
    width: 20,
    height: 20,
    backgroundColor: color,
  }));

  return (
    <Box display='flex'>
      <Box width='250px' p={2} mr={2}>
        <Typography variant='h6'>Categories</Typography>
        <List>
          {categories?.map((category) => (
            <ListItem
              key={category.id}
              onClick={() => console.log(`Category ${category.name} clicked`)}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                '&:active': {
                  backgroundColor: theme.palette.action.selected,
                },
                'color': darkTheme.colours.defaultFont,
              }}
            >
              <ListItemIcon>
                <ColorSquare color={colorMapping[category.colour]} />
              </ListItemIcon>
              <ListItemText primary={category.name} />
            </ListItem>
          ))}
        </List>
        <Button
          variant='contained'
          color='primary'
          startIcon={<AddIcon />}
          onClick={handleOpenAddCategoryModal}
          sx={{ width: '100%' }}
        >
          Add Category
        </Button>
      </Box>
      <Box flex='1'>
        <Table>
          {transactionSummaries?.map((tx) => (
            <Table.Row key={tx.id}>
              <Table.Cell>{tx.description}</Table.Cell>
              <Table.Cell>{tx.totalDebit}</Table.Cell>
              <Table.Cell>{tx.totalFrequency}</Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </Box>
      {isAddCategoryModalOpen && <AddCategoryModal handleClose={handleCloseAddCategoryModal} />}
    </Box>
  );
};

export default Categorise;
