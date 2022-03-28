import { Heading, Spacer, Table } from '@dtdot/lego';
import { useMemo } from 'react';
import { ProcessedDataRow } from '../../types/DataRow';
import { Rule } from '../../types/Rule';

interface RemainingTableProps {
  data: ProcessedDataRow[];
  rules: Rule[];
  filterText?: string;
  onFilter: (text: string) => void;
}

const RemainingTable = ({ data, rules, filterText, onFilter }: RemainingTableProps) => {
  const notMatchingRules = useMemo(
    () =>
      data
        .filter((row) => rules.every((rule) => !row.description.includes(rule.text)))
        .sort((a, b) => {
          if (a.totalAmount === b.totalAmount) {
            return b.description.localeCompare(a.description);
          }

          return b.totalAmount - a.totalAmount;
        }),
    [data, rules],
  );

  const matchingFilter = filterText
    ? notMatchingRules
        .filter((row) => row.description.toLowerCase().includes(filterText.toLowerCase()))
        .sort((a, b) => {
          if (a.count === b.count) {
            return b.description.localeCompare(a.description);
          }

          return b.count - a.count;
        })
    : undefined;

  return (
    <>
      {matchingFilter && (
        <>
          <Heading.SubHeading>{matchingFilter.length} Matching</Heading.SubHeading>
          <Spacer size='2x' />
          <Table>
            <Table.Row>
              <Table.Cell>
                <strong>Amount</strong>
              </Table.Cell>
              <Table.Cell>
                <strong>Description</strong>
              </Table.Cell>
            </Table.Row>
            {matchingFilter.map((row, index) => (
              <Table.Row key={index}>
                <Table.Cell>${row.amount}</Table.Cell>
                <Table.Cell>{row.description}</Table.Cell>
              </Table.Row>
            ))}
          </Table>
        </>
      )}

      {!matchingFilter && (
        <>
          <Heading.SubHeading>{notMatchingRules.length} Remaining</Heading.SubHeading>
          <Spacer size='2x' />
          <Table>
            <Table.Row>
              <Table.Cell>
                <strong>Amount</strong>
              </Table.Cell>
              <Table.Cell>
                <strong>Description</strong>
              </Table.Cell>
            </Table.Row>
            {notMatchingRules.map((row, index) => (
              <Table.Row key={index}>
                <Table.Cell>${row.amount}</Table.Cell>
                <Table.Cell>{row.description}</Table.Cell>
                <Table.Cell>
                  <Table.Action text='Filter' onClick={() => onFilter(row.description)} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table>
        </>
      )}
    </>
  );
};

export default RemainingTable;
