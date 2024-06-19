import React from 'react';
import { TableRow, TableCell, Select, MenuItem, Box, ListItemIcon, ListItemText } from '@mui/material';
import { colorMapping } from '../../core/colorMapping';
import styled from 'styled-components';
import { SpendingCategory, TransactionSummary } from '../../core/api.types';

const ColorSquare = styled('div')(({ color }) => ({
  width: 20,
  height: 20,
  backgroundColor: color,
}));

const SelectNameDisplay = styled.span`
  padding-left: 16px;
`;

const columns = [
  { width: 200, label: 'Description', dataKey: 'description' },
  { width: 150, label: 'Total Debit', dataKey: 'totalDebit', numeric: true },
  { width: 150, label: 'Total Frequency', dataKey: 'totalFrequency', numeric: true },
  { width: 200, label: 'Category', dataKey: 'category' },
];

interface TableRowComponentProps {
  'context': {
    categories: SpendingCategory[];
    transactionSummaries: TransactionSummary[];
    handleCategoryChange: (a: string, b: string) => void;
  };
  'data-index': number;
}

const TableRowComponent = ({ context, ...props }: TableRowComponentProps) => {
  console.log(context);
  const { categories, handleCategoryChange } = context;
  const index = props['data-index'];
  const row = context.transactionSummaries[index];

  return (
    <TableRow {...props}>
      {columns.map((column) => (
        <TableCell key={column.dataKey} align={column.numeric || false ? 'right' : 'left'}>
          {column.dataKey === 'totalDebit' ? (
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row[column.dataKey])
          ) : column.dataKey === 'category' ? (
            <Select
              value={row.spendingCategoryId || ''}
              onChange={(e) => handleCategoryChange(row.id, e.target.value)}
              displayEmpty
              fullWidth
              renderValue={(selected) => {
                const selectedCategory = categories.find((category) => category.id === selected);
                return (
                  <Box display='flex' alignItems='center'>
                    <ColorSquare color={selectedCategory ? colorMapping[selectedCategory.colour] : 'grey'} />
                    <SelectNameDisplay>{selectedCategory ? selectedCategory.name : 'Uncategorised'}</SelectNameDisplay>
                  </Box>
                );
              }}
            >
              <MenuItem value=''>
                <ListItemIcon>
                  <ColorSquare color='grey' />
                </ListItemIcon>
                <ListItemText primary='Uncategorised' />
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <ListItemIcon>
                    <ColorSquare color={colorMapping[category.colour]} />
                  </ListItemIcon>
                  <ListItemText primary={category.name} />
                </MenuItem>
              ))}
            </Select>
          ) : (
            row[column.dataKey as keyof typeof row]
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TableRowComponent;
