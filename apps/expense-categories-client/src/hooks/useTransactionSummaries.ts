import { useContext, useEffect, useState } from 'react';

import DateRangeContext, { getDateQueryEnabled, getDateQueryParams } from '../components/core/DateRangeContext';
import { apiConnector } from '../core/api.connector';
import { TransactionSummary } from '../core/api.types';

export const useTransactionSummaries = () => {
  const dateContextVal = useContext(DateRangeContext);
  const { data: _transactionSummaries, refetch } = apiConnector.app.transactions.getTransactionSummaries.useQuery(
    getDateQueryParams(dateContextVal),
    {
      enabled: getDateQueryEnabled(dateContextVal),
    },
  );
  const { mutate: assignCategory } = apiConnector.app.transactions.assignSpendingCategory.useMutation();
  const { mutate: ignoreTransactionSummary } = apiConnector.app.transactions.ignoreTransactionSummary.useMutation();
  const [transactionSummaries, setTransactionSummaries] = useState(_transactionSummaries || []);

  useEffect(() => {
    _transactionSummaries && setTransactionSummaries(_transactionSummaries);
  }, [_transactionSummaries]);

  const updateTransactionSummary = (updatedTransaction: TransactionSummary) => {
    setTransactionSummaries((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction,
      ),
    );
  };

  const handleCategoryChange = (transactionCategoryId: string, newCategoryId?: string) => {
    assignCategory(
      { transactionCategoryId, spendingCategoryId: newCategoryId || undefined },
      {
        onSuccess: (updatedTransaction) => {
          updateTransactionSummary(updatedTransaction);
        },
      },
    );
  };

  const handleIgnore = (transactionCategoryId: string) => {
    ignoreTransactionSummary(
      { transactionCategoryId },
      {
        onSuccess: (updatedTransaction) => {
          updateTransactionSummary(updatedTransaction);
        },
      },
    );
  };

  return {
    transactionSummaries,
    handleCategoryChange,
    handleIgnore,
    refetch,
  };
};
