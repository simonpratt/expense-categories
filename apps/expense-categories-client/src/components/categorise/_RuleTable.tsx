import { Table } from '@dtdot/lego';
import { useMemo } from 'react';
import { ProcessedDataRow } from '../../types/DataRow';
import { Rule } from '../../types/Rule';

const sum = (arr: number[]): number => {
  return arr.reduce((total, current) => total + current, 0);
};

interface RuleTableProps {
  data: ProcessedDataRow[];
  rules: Rule[];
  onRemove: (id: string) => void;
}

const RuleTable = ({ data, rules, onRemove }: RuleTableProps) => {
  const rulesWithValues = useMemo(() => {
    const sums: Record<string, number> = {};

    let dataWorkingSet = [...data];
    rules.forEach((rule) => {
      const matching = dataWorkingSet.filter((row) => row.description.includes(rule.text));
      dataWorkingSet = dataWorkingSet.filter((row) => !row.description.includes(rule.text));

      sums[rule.id] = sum(matching.map((row) => row.amount));
    });

    return rules.map((rule) => ({
      ...rule,
      amount: sums[rule.id],
    }));
  }, [rules, data]);

  return (
    <Table>
      <Table.Row>
        <Table.Cell>
          <strong>Total</strong>
        </Table.Cell>
        <Table.Cell>
          <strong>Filter Text</strong>
        </Table.Cell>
        <Table.Cell>
          <strong>Cetegory</strong>
        </Table.Cell>
      </Table.Row>
      {rulesWithValues.map((rule, index) => (
        <Table.Row key={index}>
          <Table.Cell>${rule.amount}</Table.Cell>
          <Table.Cell>{rule.text}</Table.Cell>
          <Table.Cell>{rule.ignore ? 'Ignored' : rule.category}</Table.Cell>
          <Table.Cell variant='tight'>
            <Table.Action text='Remove' onClick={() => onRemove(rule.id)} />
          </Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
};

export default RuleTable;
