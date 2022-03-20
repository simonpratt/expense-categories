import { CenteredLayout, Loader } from '@dtdot/lego';
import { useContext, useEffect } from 'react';
import Papa from 'papaparse';
import { NotificationContext } from '@dtdot/notifications';
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
  file: File;
  onProcessed: (data: DataRow[]) => void;
}

const Process = ({ file, onProcessed }: ProcessProps) => {
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          addNotification({ variant: 'danger', message: 'An unknown error occurred when processing your csv' });
          return;
        }

        const processed = tempParse(results.data);
        onProcessed(processed);
      },
      error: () => {
        addNotification({ variant: 'danger', message: 'An unknown error occurred when processing your csv' });
      },
    });
  }, [file, onProcessed, addNotification]);

  return (
    <CenteredLayout>
      <Loader />
    </CenteredLayout>
  );
};

export default Process;
