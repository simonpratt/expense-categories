import React, { useState, useEffect } from 'react';
import { Button, CenteredLayout, ControlGroup, Loader, Modal, Spacer } from '@dtdot/lego';
import { apiConnector } from '../../core/api.connector';
import { SpendingCategory, TransactionSummary } from '../../core/api.types';
import { Checkbox, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CategorySelect from './table/CategorySelect';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Chip } from '@mui/material';

interface AIAutoCategoriseModalProps {
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

const sortByCategory = (
  a: { spendingCategoryId: string },
  b: { spendingCategoryId: string },
  categories: SpendingCategory[],
) => {
  const aCategory = categories.find((category) => category.id === a.spendingCategoryId)?.name || 'zzzz';
  const bCategory = categories.find((category) => category.id === b.spendingCategoryId)?.name || 'zzzz';

  return aCategory.localeCompare(bCategory);
};

const AIAutoCategoriseModal: React.FC<AIAutoCategoriseModalProps> = ({ onClose, onInvalidateData }) => {
  // const [selections, setSelections] = useState<Record<string, boolean>>({});
  // const { mutateAsync: assignSpendingCategories, isPending: savingCategories } =
  //   apiConnector.app.transactions.bulkAssignSpendingCategory.useMutation();
  const { data: categories, refetch: refetchCategories } = apiConnector.app.categories.getCategories.useQuery();
  const { data } = apiConnector.app.assist.getAutoCategoriseRecommendations.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  console.log(data);

  // useEffect(() => {
  //   if (!data) return;

  //   setSelections((prevSelections) => {
  //     return Object.fromEntries(
  //       data.map((d) => [
  //         d.id,
  //         prevSelections[d.id] === undefined ? getDefaultSelectedVal(d.confidence) : prevSelections[d.id],
  //       ]),
  //     );
  //   });
  // }, [data, setSelections]);

  // const handleCheckboxChange = (id: string) => {
  //   setSelections((prev) => ({ ...prev, [id]: !prev[id] }));
  // };

  const handleApplySelection = async () => {
    // const transactionCategoryIds = Object.keys(selections).filter((k) => selections[k]);
    // const spendingCategoryId = category.id;
    // await assignSpendingCategories({ transactionCategoryIds, spendingCategoryId });
    // onInvalidateData();
    // onClose();
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

  if (!categories) {
    return null;
  }

  return (
    <Modal onClose={onClose}>
      <Modal.Header header={`Auto-categorise`} />
      <Modal.Body>
        {data?.length ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Apply</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Confidence</TableCell>
                  <TableCell>Total Debit</TableCell>
                  <TableCell>Frequency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .sort((a, b) => sortByCategory(a, b, categories || []))
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        {/* {selections[row.id] !== undefined && (
                        <Checkbox checked={selections[row.id]} onChange={() => handleCheckboxChange(row.id)} />
                      )} */}
                        abc
                      </TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>
                        <CategorySelect categories={categories} value={row.spendingCategoryId} onChange={() => {}} />
                      </TableCell>
                      {/* <TableCell>
                        {categories?.find((category) => category.id === row.spendingCategoryId)?.name}
                      </TableCell> */}
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
          {/* {Object.keys(selections).filter((k) => selections[k]).length > 0 && (
            <Button loading={savingCategories} onClick={handleApplySelection} data-testid='button-apply'>
              Apply
            </Button>
          )} */}
          12
        </ControlGroup>
      </Modal.Body>
    </Modal>
  );
};

export default AIAutoCategoriseModal;
