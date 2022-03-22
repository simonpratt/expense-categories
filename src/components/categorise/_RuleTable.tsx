import { Table } from '@dtdot/lego';
import { RuleWithData } from './Rule';

interface RuleTableProps {
  data: RuleWithData[];
  onRemove: (id: string) => void;
}

const RuleTable = ({ data, onRemove }: RuleTableProps) => (
  <Table>
    {data.map((rule, index) => (
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

export default RuleTable;
