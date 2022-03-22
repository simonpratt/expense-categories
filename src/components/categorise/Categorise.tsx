import { Button, Heading, Spacer, Table } from '@dtdot/lego';
import { useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import storage from '../../core/storage';
import HelperModalsContext from '../../external/HelperModals/HelperModals.context';

import { ProcessedDataRow } from '../../types/DataRow';
import { Rule } from './Rule';
import CategoriesTable from './_CategoriesTable';
import RuleCreator from './_RuleCreator';
import RuleTable from './_RuleTable';

const GridOuter = styled.div`
  display: grid;
  grid-template-columns: auto 500px 400px;
  grid-template-rows: auto 64px;
  grid-gap: 8px;
  padding: 16px;

  height: 100vh;
`;

const RemainingPane = styled.div`
  grid-column: 1;
  grid-row: 1;
  grid-row-end: 3;

  overflow: auto;
`;

const RulePane = styled.div`
  grid-column: 2;
  grid-row: 1;
  grid-row-end: 3;

  overflow: auto;
`;

const CategoryPane = styled.div`
  grid-column: 3;
  grid-row: 1;

  overflow: auto;
`;

const ControlPane = styled.div`
  grid-column: 3;
  grid-row: 2;

  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

export interface CategoriseProps {
  data: ProcessedDataRow[];
}

const sum = (arr: number[]): number => {
  return arr.reduce((total, current) => total + current, 0);
};

const Categorise = ({ data }: CategoriseProps) => {
  const { requestConfirmation } = useContext(HelperModalsContext);
  const [filterText, setFilterText] = useState('');
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    const oldRules = storage.getItem('rules');
    if (oldRules) {
      setRules(oldRules as any);
    }
  }, [setRules]);

  const addRule = (rule: Rule) => {
    const newRules = [...rules, rule];
    storage.setItem('rules', newRules);
    setRules(newRules);
  };

  const removeRule = (id: string) => {
    const newRules = rules.filter((rule) => rule.id !== id);
    storage.setItem('rules', newRules);
    setRules(newRules);
  };

  const onRemoveRule = (id: string) => {
    removeRule(id);
  };

  const onFilter = (text: string) => {
    setFilterText(text);
  };

  const onReset = async () => {
    const confirmed = await requestConfirmation(
      'Are you sure?',
      'Resetting with clear all of your categories and all of your filters',
    );
    if (!confirmed) {
      return;
    }

    storage.removeItem('rules');
    storage.removeItem('categories');
    window.location.reload();
  };

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
    <GridOuter>
      <RemainingPane>
        {matchingFilter && (
          <>
            <Heading.SubHeading>{matchingFilter.length} Matching</Heading.SubHeading>
            <Spacer size='1x' />
            <Table>
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
            <Spacer size='1x' />
            <Table>
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
      </RemainingPane>

      <RulePane>
        <Heading.SubHeading>New Rule</Heading.SubHeading>
        <Spacer size='1x' />
        <RuleCreator filterText={filterText} onFilterTextChange={setFilterText} onCreate={addRule} />
        <Spacer size='4x' />
        <Spacer size='4x' />
        <Heading.SubHeading>Rules</Heading.SubHeading>
        <Spacer size='1x' />
        <RuleTable data={rulesWithValues} onRemove={onRemoveRule} />
      </RulePane>

      <CategoryPane>
        <Heading.SubHeading>Summary</Heading.SubHeading>
        <Spacer size='1x' />
        <CategoriesTable data={data} rules={rules} />
      </CategoryPane>

      <ControlPane>
        <Button onClick={onReset}>Reset</Button>
      </ControlPane>
    </GridOuter>
  );
};

export default Categorise;
