import React, { useState } from 'react';
import { apiConnector } from '../../core/api.connector';
import { Table, Button, ControlLine } from '@dtdot/lego';
import { Box, List } from '@mui/material';
import AddCategoryModal from '../modals/AddCategoryModal';
import CategoryListItem from './CategoryListItem';

const Categorise = () => {
  const { data: transactionSummaries } = apiConnector.app.transactions.getSummary.useQuery();
  const { data: categories } = apiConnector.app.categories.getCategories.useQuery();
  const [isAddCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleOpenAddCategoryModal = () => {
    setAddCategoryModalOpen(true);
  };

  const handleCloseAddCategoryModal = () => {
    setAddCategoryModalOpen(false);
  };

  const selectedCategoryName = selectedCategory === 'all'
    ? 'All'
    : selectedCategory === null
    ? 'Uncategorised'
    : categories?.find((category) => category.id === selectedCategory)?.name || 'Unknown';

  const handleEditCategory = () => {
    setAddCategoryModalOpen(true);
  };

  return (
    <Box display='flex' flexDirection='column'>
      <Box display='flex' justifyContent='space-between' alignItems='center' p={2}>
        <h2>{selectedCategoryName}</h2>
        {selectedCategory && selectedCategory !== 'all' && (
          <Button variant='secondary' onClick={handleEditCategory}>
            Edit Category
          </Button>
        )}
      </Box>
    <Box display='flex'>
      <Box width='350px' p={2}>
        <List>
          <CategoryListItem
            category={{ id: 'all', name: 'All', colour: null }}
            selectedCategory={selectedCategory}
            onClick={() => setSelectedCategory('all')}
          />
          <CategoryListItem
            category={{ id: null, name: 'Uncategorised', colour: 'grey' }}
            selectedCategory={selectedCategory}
            onClick={() => setSelectedCategory(null)}
          />
          {categories?.map((category) => (
            <CategoryListItem
              key={category.id}
              category={category}
              selectedCategory={selectedCategory}
              onClick={() => setSelectedCategory(category.id)}
            />
          ))}
        </List>
        <ControlLine>
          <Button variant='tertiary' onClick={handleOpenAddCategoryModal}>
            Add Category
          </Button>
        </ControlLine>
      </Box>
      <Box flex='1' pt={3} pr={2}>
        <Table mt={2}>
          {transactionSummaries
            ?.filter((tx) => selectedCategory === 'all' || tx.spendingCategoryId === selectedCategory)
            .map((tx) => (
              <Table.Row key={tx.id}>
                <Table.Cell>{tx.description}</Table.Cell>
                <Table.Cell>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.totalDebit)}
                </Table.Cell>
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
