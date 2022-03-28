import { Spacer, Table, Text } from '@dtdot/lego';
import styled from 'styled-components';
import { ProcessedDataRow } from '../../types/DataRow';
import { Rule } from '../../types/Rule';

const SummaryLineContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

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
  let processedCount = 0;
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

    processedCount += matching.length;
    matchingCategory.total += sum(matching.map((row) => row.amount));
  });

  const sortedCategories = categoriesWithTotal.sort((a, b) => b.total - a.total);

  const minDate = Math.min(...data.map((row) => Date.parse(row.date)));
  const maxDate = Math.max(...data.map((row) => Date.parse(row.date)));

  const durationSeconds = (maxDate - minDate) / 1000;
  const durationMinutes = durationSeconds / 60;
  const durationHours = durationMinutes / 60;
  const durationDays = durationHours / 24;
  const durationWeeks = durationDays / 7;
  const durationFortnights = durationDays / 14;

  return (
    <>
      <Table>
        <Table.Row>
          <Table.Cell>
            <strong>Category</strong>
          </Table.Cell>
          <Table.Cell>
            <strong>All Time</strong>
          </Table.Cell>
          <Table.Cell>
            <strong>Per Fortnight</strong>
          </Table.Cell>
        </Table.Row>
        {sortedCategories.map((category, index) => (
          <Table.Row key={index}>
            <Table.Cell>{category.category}</Table.Cell>
            <Table.Cell>${category.total}</Table.Cell>
            <Table.Cell>${Math.floor(category.total / durationFortnights)}</Table.Cell>
          </Table.Row>
        ))}
        <Spacer size='2x' />
        <Table.Row>
          <Table.Cell>Total</Table.Cell>
          <Table.Cell>${sum(sortedCategories.map((category) => category.total))}</Table.Cell>
          <Table.Cell>
            ${Math.floor(sum(sortedCategories.map((category) => category.total)) / durationFortnights)}
          </Table.Cell>
        </Table.Row>
      </Table>
      <Spacer size='4x' />
      <SummaryLineContainer>
        <Text>
          {processedCount} transactions processed spanning {Math.floor(durationWeeks)} weeks
        </Text>
      </SummaryLineContainer>
    </>
  );
};

export default CategoriesTable;
