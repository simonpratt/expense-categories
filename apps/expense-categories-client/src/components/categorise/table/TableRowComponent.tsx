import React from 'react';
import { TableRow, TableCell } from '@mui/material';
import { SpendingCategory, TransactionSummary } from '../../../core/api.types';
import { tableColumns } from './tableColumns';
import CategorySelect from './CategorySelect';

interface TableRowComponentProps {
  'context': {
    categories: SpendingCategory[];
    transactionSummaries: TransactionSummary[];
    handleCategoryChange: (transactionSummaryId: string, spendingCategoryId?: string) => void;
    handleIgnore: (transactionSummaryId: string) => void;
  };
  'data-index': number;
}

const TableRowComponent = ({ context, ...props }: TableRowComponentProps) => {
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
                  <CategorySelect
                    categories={categories}
                    value={row.ignored ? 'ignored' : row.spendingCategoryId || 'uncategorised'}
                    onChange={(value) =>
                      value === 'ignored'
                        ? handleIgnore(row.id)
                        : handleCategoryChange(row.id, value === 'uncategorised' ? undefined : value)
                    }
                  />
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
