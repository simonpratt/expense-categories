import React, { useState, useEffect, useContext } from 'react';

import { Button, CenteredLayout, ControlGroup, Loader, Modal, Spacer } from '@dtdot/lego';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Chip } from '@mui/material';

import { apiConnector } from '../../core/api.connector';
import { SpendingCategory } from '../../core/api.types';
import DateRangeContext, { getDateQueryEnabled, getDateQueryParams } from '../core/DateRangeContext';

interface AISearchTransactionsModalProps {
  category: SpendingCategory;
  onClose: () => void;
  onInvalidateData: () => void;
}

const getDefaultSelectedVal = (confidence: string) => {
  console.log('checking', confidence);
  switch (confidence.toLowerCase()) {
    case 'high':
    case 'medium':
      return true;
    default:
      return false;
  }
};

const AISearchTransactionsModal: React.FC<AISearchTransactionsModalProps> = ({
  category,
  onClose,
  onInvalidateData,
}) => {
  const dateContextVal = useContext(DateRangeContext);
  const [selections, setSelections] = useState<Record<string, boolean>>({});
  const { mutateAsync: assignSpendingCategories, isPending: savingCategories } =
    apiConnector.app.transactions.bulkAssignSpendingCategory.useMutation();
  const { data } = apiConnector.app.assist.searchForTransactions.useQuery(
    { spendingCategoryId: category.id, ...getDateQueryParams(dateContextVal) },
    {
      refetchOnWindowFocus: false,
      enabled: getDateQueryEnabled(dateContextVal),
    },
  );

  useEffect(() => {
    if (!data) return;

    setSelections((prevSelections) => {
      return Object.fromEntries(
        data.map((d) => [
          d.id,
          prevSelections[d.id] === undefined ? getDefaultSelectedVal(d.confidence) : prevSelections[d.id],
        ]),
      );
    });
  }, [data, setSelections]);

  const handleCheckboxChange = (id: string) => {
    setSelections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApplySelection = async () => {
    const transactionCategoryIds = Object.keys(selections).filter((k) => selections[k]);
    const spendingCategoryId = category.id;
    await assignSpendingCategories({ transactionCategoryIds, spendingCategoryId });
    onInvalidateData();
    onClose();
  };

  const getConfidenceChipProps = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'high':
        return { color: 'success' as const, label: 'High' };
      case 'medium':
        return { color: 'warning' as const, label: 'Medium' };
      case 'low':
        return { color: 'error' as const, label: 'Low' };
      default:
        return { color: 'default' as const, label: confidence };
    }
  };

  return (
    <Modal onClose={onClose}>
      <Modal.Header header={`Search Transactions`} />
      <Modal.Body>
        {data?.length ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Apply</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Confidence</TableCell>
                  <TableCell>Total Debit</TableCell>
                  <TableCell>Frequency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      {selections[row.id] !== undefined && (
                        <Checkbox checked={selections[row.id]} onChange={() => handleCheckboxChange(row.id)} />
                      )}
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>
                      <Chip {...getConfidenceChipProps(row.confidence)} size='small' />
                    </TableCell>
                    <TableCell>{row.totalDebit}</TableCell>
                    <TableCell>{row.totalFrequency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <CenteredLayout>
            <Spacer size='4x' />
            <Loader />
          </CenteredLayout>
        )}
        <Spacer size='4x' />
        <ControlGroup variation='comfortable'>
          {Object.keys(selections).filter((k) => selections[k]).length > 0 && (
            <Button loading={savingCategories} onClick={handleApplySelection} data-testid='button-apply'>
              Apply
            </Button>
          )}
        </ControlGroup>
      </Modal.Body>
    </Modal>
  );
};

export default AISearchTransactionsModal;
