// my-table.ts
import React, { useState } from 'react';
import { apiConnector } from '../../core/api.connector';
import { Spacer, Loader } from '@dtdot/lego';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Paper,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import AddCategoryModal from '../modals/AddCategoryModal';
import EditCategoryModal from '../modals/EditCategoryModal';
import CategoryList from './CategoryList';
import CategoryHeader from './CategoryHeader';
import { useTransactionSummaries } from '../../hooks/useTransactionSummaries';
import TableRowComponent from './TableRowComponent';

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

const fixedHeaderContent = () => (
  <TableRow>
    {columns.map((column) => (
      <TableCell
        key={column.dataKey}
        variant='head'
        align={column.numeric || false ? 'right' : 'left'}
        style={{ width: column.width }}
        sx={{
          backgroundColor: 'background.paper',
        }}
      >
        {column.label}
      </TableCell>
    ))}
  </TableRow>
);

const Categorise = () => {
  const { transactionSummaries, handleCategoryChange } = useTransactionSummaries();
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

  const renderedData = transactionSummaries.filter(
    (tx) => selectedCategory === 'all' || tx.spendingCategoryId === selectedCategory,
  );

  return (
    <Box display='flex'>
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setAddModalOpen={setAddModalOpen}
      />
      <Box flex='1' pr={2} pt={1} display='flex' flexDirection='column'>
        <CategoryHeader
          selectedCategoryName={selectedCategoryName}
          selectedCategory={selectedCategory}
          setEditModalOpen={setEditModalOpen}
        />
        <Spacer size='1x' />
        <div style={{ width: '100%', height: 'calc(100vh - 140px)' }}>
          <TableVirtuoso
            data={renderedData}
            components={VirtuosoTableComponents}
            fixedHeaderContent={fixedHeaderContent}
            style={{ height: '100%' }}
            context={{ transactionSummaries: renderedData, categories, handleCategoryChange }}
          />
        </div>
      </Box>
      {isAddModalOpen && <AddCategoryModal handleClose={() => setAddModalOpen(false)} />}
      {isEditModalOpen && selectedCategoryObj && (
        <EditCategoryModal category={selectedCategoryObj} handleClose={() => setEditModalOpen(false)} />
      )}
    </Box>
  );
};

export default Categorise;
