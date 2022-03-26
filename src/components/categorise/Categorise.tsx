import { Button, Heading, Spacer } from '@dtdot/lego';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import storage from '../../core/storage';
import HelperModalsContext from '../../external/HelperModals/HelperModals.context';

import { ProcessedDataRow } from '../../types/DataRow';
import { Rule } from '../../types/Rule';
import CategoriesTable from './_CategoriesTable';
import RemainingTable from './_RemainingTable';
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

  const onReset = async () => {
    const confirmed = await requestConfirmation(
      'Are you sure?',
      'Resetting with clear all of your categories and all of your filters',
    );
    if (!confirmed) {
      return;
    }

    storage.removeItem('data');
    storage.removeItem('rules');
    storage.removeItem('categories');
    window.location.reload();
  };

  return (
    <GridOuter>
      <RemainingPane>
        <RemainingTable data={data} rules={rules} filterText={filterText} onFilter={setFilterText} />
      </RemainingPane>

      <RulePane>
        <Heading.SubHeading>New Rule</Heading.SubHeading>
        <Spacer size='1x' />
        <RuleCreator filterText={filterText} onFilterTextChange={setFilterText} onCreate={addRule} />
        <Spacer size='4x' />
        <Spacer size='4x' />
        <Heading.SubHeading>Rules</Heading.SubHeading>
        <Spacer size='1x' />
        <RuleTable data={data} rules={rules} onRemove={removeRule} />
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
