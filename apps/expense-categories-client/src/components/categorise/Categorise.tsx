import React from 'react';
import { apiConnector } from '../../core/api.connector';
import { Table } from '@dtdot/lego';

const Categorise = () => {
  const { data: transactionSummaries, isLoading } = apiConnector.app.transactions.getSummary.useQuery();
  return (
    <div>
      <Table>
        {transactionSummaries?.map((tx) => (
          <Table.Row key={tx.id}>
            <Table.Cell>{tx.description}</Table.Cell>
            <Table.Cell>{tx.totalDebit}</Table.Cell>
            <Table.Cell>{tx.totalFrequency}</Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
};

export default Categorise;
