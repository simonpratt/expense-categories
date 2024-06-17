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

  return (
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
        <Table>
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
