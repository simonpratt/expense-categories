import React, { useMemo } from 'react';
import { Table, TableBody, TableContainer, Paper, TableHead, TableRow, TableCell } from '@mui/material';
import { Transaction, SpendingCategory } from '../../core/api.types';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import ColorSquare from '../common/ColorSquare';

const Container = styled.div`
  padding: 8px 24px;
`;

const CategoryDisplayContainer = styled.span`
  display: flex;

  > :first-child {
    margin-right: 8px;
  }
`;

interface TransactionTableProps {
  transactions: Transaction[];
  categories: SpendingCategory[];
  visibleCategories: string[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, categories, visibleCategories }) => {
  const filteredTransactions = useMemo(
    () =>
      transactions.filter((t) =>
        visibleCategories.includes(categories.find((c) => c.id === t.spendingCategoryId)?.name || 'Uncategorized'),
      ),
    [transactions, categories, visibleCategories],
  );

  const sortedTransactions = filteredTransactions.sort(
    (a, b) => DateTime.fromISO(a.date).diff(DateTime.fromISO(b.date)).milliseconds,
  );

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align='right'>Debit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTransactions.map((tx) => (
              <TableRow key={tx.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{DateTime.fromISO(tx.date).toFormat('dd LLL yyyy')}</TableCell>
                <TableCell component='th' scope='row'>
                  {tx.description}
                </TableCell>
                <TableCell>
                  <CategoryDisplayContainer>
                    <ColorSquare
                      colorKey={categories.find((cat) => cat.id === tx.spendingCategoryId)?.colour || 'Uncategorised'}
                    />
                    {categories.find((cat) => cat.id === tx.spendingCategoryId)?.name || 'Uncategorised'}
                  </CategoryDisplayContainer>
                </TableCell>
                <TableCell align='right'>{tx.debit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TransactionTable;
