import React from 'react';

import { TableRow, TableCell } from '@mui/material';

import { tableColumns } from './tableColumns';

const TableHeaderCell = () => (
  <TableRow>
    {tableColumns.map((column) => (
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

export default TableHeaderCell;
