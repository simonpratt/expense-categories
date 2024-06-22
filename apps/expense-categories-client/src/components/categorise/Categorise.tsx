// my-table.ts
import React, { useState } from 'react';
import { apiConnector } from '../../core/api.connector';
import { Spacer, Loader } from '@dtdot/lego';
import { Box, Table, TableBody, TableContainer, TableHead, Paper } from '@mui/material';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import AddCategoryModal from '../modals/AddCategoryModal';
import EditCategoryModal from '../modals/EditCategoryModal';
import CategoryList from './CategoryList';
import CategoryHeader from './CategoryHeader';
import { useTransactionSummaries } from '../../hooks/useTransactionSummaries';
import TableRowComponent from './table/TableRowComponent';
import TableHeaderCell from './table/TableHeaderCell';
import { TransactionSummary } from '../../core/api.types';
import AICategorisationBanner from './AICategorisationBanner';
import AISearchTransactionsModal from './AISearchTransactionsModal';
import { FilterCategory, systemCategories, systemCategoryUncategorised } from './filterCategories';
import AIAutoCategoriseModal from './AIAutoCategoriseModal';

const VirtuosoTableComponents: TableComponents<TransactionSummary> = {
  Scroller: React.forwardRef<HTMLDivElement>(function Scroll(props, ref) {
    return <TableContainer component={Paper} {...props} ref={ref} />;
  }),
  Table: (props) => <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />,
  TableHead: TableHead as any,
  TableRow: TableRowComponent as any,
  TableBody: React.forwardRef<HTMLTableSectionElement>(function TBody(props, ref) {
    return <TableBody {...props} ref={ref} />;
  }),
};

const Categorise = () => {
  const {
    transactionSummaries,
    handleCategoryChange,
    handleIgnore,
    refetch: refetchTransactionSummaries,
  } = useTransactionSummaries();
  const { data: dbCategories, refetch: refetchCategories } = apiConnector.app.categories.getCategories.useQuery();
  const { mutateAsync: deleteCategory } = apiConnector.app.categories.deleteCategory.useMutation();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>(systemCategoryUncategorised);
  const [isAISearchTransactionsOpen, setAISearchTransactionsOpen] = useState(false);
  const [isAIAutoCategoriseOpen, setAIAutoCategoriseOpen] = useState(false);

  const categories: FilterCategory[] = [
    ...systemCategories,
    ...(dbCategories || [])
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((category) => ({
        ...category,
        fromDatabase: true,
        filterFn: (tx: TransactionSummary) => tx.spendingCategoryId === category.id,
      })),
  ];

  const handleDeleteCategory = async () => {
    if (selectedCategory?.id && selectedCategory.fromDatabase) {
      try {
        await deleteCategory({ id: selectedCategory.id });
        await refetchCategories();
        await refetchTransactionSummaries();
        setSelectedCategory(systemCategoryUncategorised);
      } catch (error) {
        console.error('Failed to delete category:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  if (!categories || !transactionSummaries) {
    return <Loader variant='page-loader' />;
  }

  const renderedData = transactionSummaries.filter(selectedCategory.filterFn);
  const dbCategory = dbCategories?.find((category) => category.id === selectedCategory.id);

  return (
    <Box display='flex'>
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setAddModalOpen={setAddModalOpen}
        transactionSummaries={transactionSummaries}
      />
      <Box flex='1' pr={2} pt={1} display='flex' flexDirection='column'>
        <CategoryHeader
          selectedCategory={selectedCategory}
          setEditModalOpen={setEditModalOpen}
          onDeleteCategory={handleDeleteCategory}
        />
        {selectedCategory && selectedCategory.fromDatabase && (
          <AICategorisationBanner
            message='Search for Transactions'
            subMessage='Search your uncategorised transactions for matches'
            onStart={() => setAISearchTransactionsOpen(true)}
          />
        )}
        {selectedCategory.id === 'uncategorised' && (
          <AICategorisationBanner
            message='Auto-categorise'
            subMessage='Auto-categorise the top transactions'
            onStart={() => setAIAutoCategoriseOpen(true)}
          />
        )}
        <Spacer size='1x' />
        <div style={{ width: '100%', height: 'calc(100vh - 140px)' }}>
          <TableVirtuoso
            data={renderedData}
            components={VirtuosoTableComponents}
            fixedHeaderContent={TableHeaderCell}
            style={{ height: '100%' }}
            context={{
              transactionSummaries: renderedData,
              categories: dbCategories,
              handleCategoryChange,
              handleIgnore,
            }}
          />
        </div>
      </Box>
      {isAddModalOpen && (
        <AddCategoryModal onClose={() => setAddModalOpen(false)} onInvalidateData={refetchCategories} />
      )}
      {isEditModalOpen && dbCategory && (
        <EditCategoryModal
          category={dbCategory}
          onClose={() => setEditModalOpen(false)}
          onInvalidateData={refetchCategories}
        />
      )}
      {isAISearchTransactionsOpen && dbCategory && (
        <AISearchTransactionsModal
          category={dbCategory}
          onClose={() => setAISearchTransactionsOpen(false)}
          onInvalidateData={() => refetchTransactionSummaries()}
        />
      )}
      {isAIAutoCategoriseOpen && (
        <AIAutoCategoriseModal
          onClose={() => setAIAutoCategoriseOpen(false)}
          onInvalidateData={() => refetchTransactionSummaries()}
        />
      )}
    </Box>
  );
};

export default Categorise;
