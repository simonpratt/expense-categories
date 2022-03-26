import { Table } from '@dtdot/lego';
import { ProcessedDataRow } from '../../types/DataRow';
import { Rule } from '../../types/Rule';

function onlyUnique<T>(value: T, index: number, self: T[]) {
  return self.indexOf(value) === index;
}

const sum = (arr: number[]): number => {
  return arr.reduce((total, current) => total + current, 0);
};

export interface CategoriesTableProps {
  data: ProcessedDataRow[];
  rules: Rule[];
}

const CategoriesTable = ({ data, rules }: CategoriesTableProps) => {
  const categories = rules
    .map((rule) => rule.category)
    .filter((category) => !!category)
    .filter(onlyUnique);

  const categoriesWithTotal = categories.map((category) => ({ total: 0, category }));

  let remainingData = data;
  rules.forEach((rule) => {
    if (rule.ignore) {
      remainingData = remainingData.filter((row) => !row.description.includes(rule.text));
      return;
    }

    const matching = remainingData.filter((row) => row.description.includes(rule.text));
    remainingData = remainingData.filter((row) => !row.description.includes(rule.text));

    const matchingCategory = categoriesWithTotal.find((_c) => _c.category === rule.category);
    if (!matchingCategory) {
      return;
    }

    matchingCategory.total += sum(matching.map((row) => row.amount));
  });

  const sortedCategories = categoriesWithTotal.sort((a, b) => b.total - a.total);

  return (
    <Table>
      {sortedCategories.map((category, index) => (
        <Table.Row key={index}>
          <Table.Cell>{category.category}</Table.Cell>
          <Table.Cell>${category.total}</Table.Cell>
          <Table.Cell>${Math.floor(category.total / 26)}</Table.Cell>
        </Table.Row>
      ))}
      <Table.Row>
        <Table.Cell>Total</Table.Cell>
        <Table.Cell>${sum(sortedCategories.map((category) => category.total))}</Table.Cell>
        <Table.Cell>${Math.floor(sum(sortedCategories.map((category) => category.total)) / 26)}</Table.Cell>
      </Table.Row>
    </Table>
  );
};

export default CategoriesTable;
