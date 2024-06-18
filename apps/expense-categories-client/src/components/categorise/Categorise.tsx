import React, { useState } from 'react';
import { apiConnector } from '../../core/api.connector';
import { Spacer, Loader } from '@dtdot/lego';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import AddCategoryModal from '../modals/AddCategoryModal';
import EditCategoryModal from '../modals/EditCategoryModal';
import CategoryList from './CategoryList';
import CategoryHeader from './CategoryHeader';

const Categorise = () => {
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

  if (!categories || !transactionSummaries) {
    return <Loader variant='page-loader' />;
  }

  return (
    <Box display='flex'>
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setAddModalOpen={setAddModalOpen}
      />
      <Box flex='1' pr={2} pt={1}>
        <CategoryHeader
          selectedCategoryName={selectedCategoryName}
          selectedCategory={selectedCategory}
          setEditModalOpen={setEditModalOpen}
        />
        <Spacer size='1x' />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Total Debit</TableCell>
                <TableCell>Total Frequency</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactionSummaries
                ?.filter((tx) => selectedCategory === 'all' || tx.spendingCategoryId === selectedCategory)
                .map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.description}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.totalDebit)}
                    </TableCell>
                    <TableCell>{tx.totalFrequency}</TableCell>
                    <TableCell>todo action goes here</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {isAddModalOpen && <AddCategoryModal handleClose={() => setAddModalOpen(false)} />}
      {isEditModalOpen && selectedCategoryObj && (
        <EditCategoryModal category={selectedCategoryObj} handleClose={() => setEditModalOpen(false)} />
      )}
    </Box>
  );
};

export default Categorise;
