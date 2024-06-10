import React from 'react';
import { Button, CenteredLayout, Heading, PaddedLayout, Spacer, Table, Text } from '@dtdot/lego';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DataRow } from '../../types/DataRow';

const requirementMap = (rawData: Record<string, string>, requirements: Requirement[]) => {
  const obj: Record<string, string> = {};
  requirements.forEach((req) => {
    if (req.csvKey) {
      obj[req.outputKey] = rawData[req.csvKey];
    }
  });

  return obj as any as DataRow;
};

const requirementParse = (rawData: Record<string, string>[], requirements: Requirement[]): DataRow[] => {
  return rawData.map((row) => requirementMap(row, requirements));
};

const StyledTableCell = styled(Table.Cell)`
  max-width: 400px;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export interface ProcessProps {
  rawData: Record<string, string>[];
  onProcessed: (data: DataRow[]) => void;
}

interface Requirement {
  message: string;
  outputKey: string;
  csvKey?: string;
}

const baseRequirements: Requirement[] = [
  {
    message: 'Select the column that has the transaction date',
    outputKey: 'date',
    csvKey: undefined,
  },
  {
    message: 'Select the column that has the description',
    outputKey: 'description',
    csvKey: undefined,
  },
  {
    message: 'Select the column that has the debit amount',
    outputKey: 'amount',
    csvKey: undefined,
  },
];

/**
 * Component for defining the column mappings for the provided CSV file
 */
const Process = ({ rawData, onProcessed }: ProcessProps) => {
  const [requirements, setRequirements] = useState(baseRequirements);

  useEffect(() => {
    const finishedMatching = requirements.every((req) => !!req.csvKey);
    if (finishedMatching) {
      onProcessed(requirementParse(rawData, requirements));
    }
  }, [rawData, requirements, onProcessed]);

  if (!rawData.length) {
    return (
      <CenteredLayout>
        <Heading.SubHeading>No data found in csv</Heading.SubHeading>
      </CenteredLayout>
    );
  }

  const nextRequirement = requirements.find((req) => !req.csvKey);
  const matchedCsvKeys = requirements.map((req) => req.csvKey).filter((key) => !!key);

  if (!nextRequirement) {
    return null;
  }

  const columns = Object.keys(rawData[0]);

  const setCsvKey = (requirement: Requirement, csvKey: string) => {
    const newRequrements = requirements.map((req) =>
      req.outputKey === requirement.outputKey ? { ...req, csvKey } : req,
    );
    setRequirements([...newRequrements]);
  };

  return (
    <PaddedLayout>
      <Heading.SubHeading>Parsing</Heading.SubHeading>
      <Spacer size='1x' />
      <Text>{nextRequirement.message}</Text>

      <Spacer size='4x' />

      <Table>
        <Table.Row>
          {columns.map((col) => (
            <Table.Cell key={col}>
              <Button onClick={() => setCsvKey(nextRequirement, col)} variant='tertiary'>
                {col}
              </Button>
            </Table.Cell>
          ))}
        </Table.Row>
        {rawData.map((row, index) => (
          <Table.Row key={index}>
            {columns.map((col) => (
              <StyledTableCell key={col}>
                <Text variant={matchedCsvKeys.includes(col) ? 'secondary' : 'primary'}>{row[col]}</Text>
              </StyledTableCell>
            ))}
          </Table.Row>
        ))}
      </Table>
    </PaddedLayout>
  );
};

export default Process;
