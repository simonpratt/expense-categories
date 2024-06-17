import React, { useState } from 'react';
import { apiConnector } from '../../core/api.connector';
import { Table, Button, ControlLine, Heading, Spacer } from '@dtdot/lego';
import { Box, List, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCategoryModal from '../modals/AddCategoryModal';
import CategoryListItem from './CategoryListItem';
import styled, { useTheme } from 'styled-components';
import EditCategoryModal from '../modals/EditCategoryModal';

const CustomHeading = styled(Heading.SubHeading)`
  height: 40px;
  display: flex;
  align-items: center;
`;

const Categorise = () => {
  const theme = useTheme() as any;
  const { data: transactionSummaries } = apiConnector.app.transactions.getSummary.useQuery();
  const { data: categories } = apiConnector.app.categories.getCategories.useQuery();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const selectedCategoryObj = categories?.find((category) => category.id === selectedCategory);

  let selectedCategoryName: string;
  switch (selectedCategory) {
    case 'all':
      selectedCategoryName = 'All';
      break;
    case null:
      selectedCategoryName = 'Uncategorised';
      break;
    default:
      selectedCategoryName = selectedCategoryObj?.name || 'Unknown';
  }

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
          {categories
            ?.sort((a, b) => a.name.localeCompare(b.name))
            .map((category) => (
              <CategoryListItem
                key={category.id}
                category={category}
                selectedCategory={selectedCategory}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
        </List>
        <ControlLine>
          <Button variant='tertiary' onClick={() => setAddModalOpen(true)}>
            Add Category
          </Button>
        </ControlLine>
      </Box>
      <Box flex='1' pr={2} pt={1}>
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
        <Spacer size='1x' />
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
      {isAddModalOpen && <AddCategoryModal handleClose={() => setAddModalOpen(false)} />}
      {isEditModalOpen && selectedCategoryObj && (
        <EditCategoryModal category={selectedCategoryObj} handleClose={() => setEditModalOpen(false)} />
      )}
    </Box>
  );
};

export default Categorise;
