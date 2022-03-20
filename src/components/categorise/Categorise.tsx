import { Button, ButtonGroup, ControlGroup, Heading, Input, Spacer, Table } from '@dtdot/lego';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import storage from '../../core/storage';

import { ProcessedDataRow } from '../../types/DataRow';
import { Rule } from './Rule';
import RuleTable from './_RuleTable';

const GridOuter = styled.div`
  display: grid;
  grid-template-columns: auto 600px;
`;

const RemainingPane = styled.div`
  grid-column: 1;
  grid-row: 2;

  padding: 16px;
`;

const RulePane = styled.div`
  grid-column: 2;
  grid-row: 2;

  padding: 16px;
`;

export interface CategoriseProps {
  data: ProcessedDataRow[];
}

const sum = (arr: number[]): number => {
  return arr.reduce((total, current) => total + current, 0);
};

const Categorise = ({ data }: CategoriseProps) => {
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

  const onNewRule = () => {
    addRule({ id: v4(), text: filterText.toLowerCase(), ignore: false });
    setFilterText('');
  };

  const onIgnoreRule = () => {
    addRule({ id: v4(), text: filterText.toLowerCase(), ignore: true });
    setFilterText('');
  };

  const onRemoveRule = (id: string) => {
    removeRule(id);
  };

  const onFilter = (text: string) => {
    setFilterText(text);
  };

  const notMatchingRules = useMemo(
    () =>
      data
        .filter((row) => rules.every((rule) => !row.description.includes(rule.text)))
        .sort((a, b) => {
          if (a.count === b.count) {
            return b.description.localeCompare(a.description);
          }

          return b.count - a.count;
        }),
    [data, rules],
  );

  const rulesWithValues = useMemo(
    () =>
      rules.map((rule) => ({
        ...rule,
        amount: sum(data.filter((row) => row.description.includes(rule.text)).map((row) => row.amount)),
      })),
    [rules, data],
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
        <Heading.SubHeading>Rules</Heading.SubHeading>
        <Spacer size='1x' />
        <ControlGroup variation='submission'>
          <Input value={filterText} onChange={setFilterText} />
          <ButtonGroup>
            <Button variant='secondary' onClick={onIgnoreRule}>
              Ignore
            </Button>
            <Button onClick={onNewRule}>New Rule</Button>
          </ButtonGroup>
        </ControlGroup>
        <Spacer size='4x' />
        <RuleTable data={rulesWithValues} onRemove={onRemoveRule} />
      </RulePane>
    </GridOuter>
  );
};

export default Categorise;
