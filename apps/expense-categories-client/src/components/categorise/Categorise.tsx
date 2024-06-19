// my-table.ts
import React, { useState } from 'react';
import { apiConnector } from '../../core/api.connector';
import { Spacer, Loader, Themes } from '@dtdot/lego';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import AddCategoryModal from '../modals/AddCategoryModal';
import EditCategoryModal from '../modals/EditCategoryModal';
import CategoryList from './CategoryList';
import CategoryHeader from './CategoryHeader';

const Categorise = () => {
  const { data: transactionSummaries } = apiConnector.app.transactions.getSummary.useQuery();
  const { data: categories } = apiConnector.app.categories.getCategories.useQuery();
  const { mutate: assignCategory } = apiConnector.app.transactions.assignSpendingCategory.useMutation();
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

  const columns = [
    { width: 200, label: 'Description', dataKey: 'description' },
    { width: 150, label: 'Total Debit', dataKey: 'totalDebit', numeric: true },
    { width: 150, label: 'Total Frequency', dataKey: 'totalFrequency', numeric: true },
    { width: 120, label: 'Action', dataKey: 'action' },
    { width: 200, label: 'Category', dataKey: 'category' },
  ];

  const VirtuosoTableComponents: TableComponents<(typeof transactionSummaries)[number]> = {
    Scroller: React.forwardRef<HTMLDivElement>(function Scroll(props, ref) {
      return <TableContainer {...props} ref={ref} />;
    }),
    Table: (props) => <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />,
    TableHead: TableHead as any,
    TableRow: (props) => <TableRow {...props} />,
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
          sx={{ backgroundColor: Themes.dark.colours.background }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );

  const handleCategoryChange = (transactionCategoryId: string, newCategoryId: string) => {
    assignCategory({ transactionCategoryId, spendingCategoryId: newCategoryId });
  };

  const rowContent = (_index: number, row: (typeof transactionSummaries)[number]) => (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell key={column.dataKey} align={column.numeric || false ? 'right' : 'left'}>
          {column.dataKey === 'totalDebit' ? (
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row[column.dataKey])
          ) : column.dataKey === 'category' ? (
            <select value={row.spendingCategoryId || ''} onChange={(e) => handleCategoryChange(row.id, e.target.value)}>
              <option value=''>Uncategorised</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          ) : (
            row[column.dataKey as keyof typeof row]
          )}
        </TableCell>
      ))}
    </React.Fragment>
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
            data={transactionSummaries.filter(
              (tx) => selectedCategory === 'all' || tx.spendingCategoryId === selectedCategory,
            )}
            components={VirtuosoTableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent}
            style={{ height: '100%' }}
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
