import { CenteredLayout, Loader } from '@dtdot/lego';
import { useEffect } from 'react';
import { DataRow } from '../../types/DataRow';

const tempMap = (row: any): DataRow => {
  return {
    date: row.Date,
    description: row.Description,
    amount: row.Debit,
  };
};

const tempParse = (data: any[]) => {
  return data.filter((row) => !!row.Debit).map(tempMap);
};

export interface ProcessProps {
  rawData: Record<string, string>[];
  onProcessed: (data: DataRow[]) => void;
}

/**
 * Component for defining the column mappings for the provided CSV file
 */
const Process = ({ rawData, onProcessed }: ProcessProps) => {
  useEffect(() => {
    const processed = tempParse(rawData);
    onProcessed(processed);
  }, [rawData, onProcessed]);

  return (
    <CenteredLayout>
      <Loader />
    </CenteredLayout>
  );
};

export default Process;
