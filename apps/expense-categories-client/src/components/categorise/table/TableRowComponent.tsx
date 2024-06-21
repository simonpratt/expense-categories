import React from 'react';
import { TableRow, TableCell, Select, MenuItem, Box, ListItemIcon, ListItemText } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';
import { SpendingCategory, TransactionSummary } from '../../../core/api.types';
import { tableColumns } from './tableColumns';
import ColorSquare from '../../common/ColorSquare';

const SelectNameDisplay = styled.span`
  padding-left: 16px;
`;

interface TableRowComponentProps {
  'context': {
    categories: SpendingCategory[];
    transactionSummaries: TransactionSummary[];
    handleCategoryChange: (transactionSummaryId: string, spendingCategoryId: string) => void;
    handleIgnore: (transactionSummaryId: string) => void;
  };
  'data-index': number;
}

const TableRowComponent = ({ context, ...props }: TableRowComponentProps) => {
  const theme = useTheme();
  const { categories, handleCategoryChange, handleIgnore } = context;
  const index = props['data-index'];
  const row = context.transactionSummaries[index];

  return (
    <TableRow {...props}>
      {tableColumns.map((column) => (
        <TableCell key={column.dataKey} align={column.numeric || false ? 'right' : 'left'}>
          {(() => {
            switch (column.dataKey) {
              case 'totalDebit':
                return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                  row[column.dataKey],
                );
              case 'category':
                return (
                  <Select
                    value={row.spendingCategoryId || ''}
                    onChange={(e) =>
                      e.target.value === 'ignore' ? handleIgnore(row.id) : handleCategoryChange(row.id, e.target.value)
                    }
                    displayEmpty
                    fullWidth
                    renderValue={(selected) => {
                      const selectedCategory = categories.find((category) => category.id === selected);
                      return (
                        <Box display='flex' alignItems='center'>
                          <ColorSquare colorKey={selectedCategory?.colour} />
                          <SelectNameDisplay>
                            {selectedCategory ? selectedCategory.name : 'Uncategorised'}
                          </SelectNameDisplay>
                        </Box>
                      );
                    }}
                  >
                    <MenuItem value='ignore'>
                      <ListItemIcon>
                        <Visibility style={{ color: theme.palette.text.primary }} />
                      </ListItemIcon>
                      <ListItemText primary='Ignore' />
                    </MenuItem>
                    <MenuItem value=''>
                      <ListItemIcon>
                        <ColorSquare colorKey={'grey'} />
                      </ListItemIcon>
                      <ListItemText primary='Uncategorised' />
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        <ListItemIcon>
                          <ColorSquare colorKey={category.colour} />
                        </ListItemIcon>
                        <ListItemText primary={category.name} />
                      </MenuItem>
                    ))}
                  </Select>
                );
              default:
                return row[column.dataKey as keyof typeof row];
            }
          })()}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TableRowComponent;
