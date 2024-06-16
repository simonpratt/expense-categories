import React from 'react';
import { DialoguesContext } from '@dtdot/dialogues';
import { BadgeSelector, Button, ButtonGroup, ControlGroup, Input } from '@dtdot/lego';
import { BadgeSelectorOption } from '@dtdot/lego/build/components/BadgeSelector/BadgeSelector.component';
import { useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import storage from '../../core/storage';
import { Rule } from '../../types/Rule';

const HSpacer = styled.div`
  flex-grow: 1;
`;

export interface RuleCreatorProps {
  filterText: string;
  onFilterTextChange: (text: string) => void;
  onCreate: (rule: Rule) => void;
}

const RuleCreator = ({ filterText, onFilterTextChange, onCreate }: RuleCreatorProps) => {
  const { requestInput } = useContext(DialoguesContext);
  const [categories, setCategories] = useState<string[]>(['unknown']);
  const [selectedCategory, setSelectedCategory] = useState<string>('unknown');

  useEffect(() => {
    const oldCategories = storage.getItem<string[]>('categories');
    if (oldCategories) {
      setCategories(oldCategories);
    }
  }, [setCategories]);

  const onNewRule = () => {
    onCreate({
      id: v4(),
      text: filterText.toLowerCase(),
      ignore: false,
      category: selectedCategory || 'unknown',
    });

    onFilterTextChange('');
  };

  const onIgnoreRule = () => {
    onCreate({
      id: v4(),
      text: filterText.toLowerCase(),
      ignore: true,
    });

    onFilterTextChange('');
  };

  const onAddCategory = async () => {
    const name = await requestInput('Category Name?');

    if (!name) {
      return;
    }

    const newCategories = [...categories, name.toLowerCase()];
    storage.setItem('categories', newCategories);
    setCategories(newCategories);
  };

  const selectedCategories = useMemo(() => (selectedCategory ? [selectedCategory] : []), [selectedCategory]);

  const options: BadgeSelectorOption[] = categories.map((category) => ({
    value: category,
    name: category,
    variant: 'info',
  }));

  return (
    <ControlGroup variation='submission'>
      <Input value={filterText} onChange={onFilterTextChange} />
      <BadgeSelector
        options={options}
        value={selectedCategories}
        onChange={(_categories) => setSelectedCategory(_categories[0])}
      />
      <ButtonGroup>
        <Button variant='tertiary' onClick={onAddCategory}>
          New Category
        </Button>
        <HSpacer />
        <Button variant='secondary' onClick={onIgnoreRule}>
          Ignore
        </Button>
        <Button onClick={onNewRule}>Create Rule</Button>
      </ButtonGroup>
    </ControlGroup>
  );
};

export default RuleCreator;
