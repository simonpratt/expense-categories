import React, { useState } from 'react';
import { apiConnector } from '../../core/api.connector';
import { Table } from '@dtdot/lego';
import { Box, Button, List, ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import AddCategoryModal from '../modals/AddCategoryModal';
import { Add as AddIcon, Circle as CircleIcon } from '@mui/icons-material';

const colorMapping = {
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
  yellow: '#FFFF00',
  purple: '#800080',
  orange: '#FFA500',
};

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

  return (
    <Box display='flex'>
      <Box width='250px' p={2} mr={2}>
        <Typography variant='h6'>Categories</Typography>
        <List>
          {categories?.map((category) => (
            <ListItem key={category.id}>
              <ListItemIcon>
                <CircleIcon style={{ color: colorMapping[category.colour] }} />
              </ListItemIcon>
              <ListItemText primary={category.name} />
            </ListItem>
          ))}
        </List>
        <Button variant='contained' color='primary' startIcon={<AddIcon />} onClick={handleOpenAddCategoryModal}>
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
