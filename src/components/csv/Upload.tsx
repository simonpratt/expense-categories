import {
  Button,
  CenteredLayout,
  ControlGroup,
  FileContext,
  FocusLayout,
  Heading,
  ImageUpload,
  Spacer,
  Text,
} from '@dtdot/lego';
import { NotificationContext } from '@dtdot/notifications';
import React, { useContext } from 'react';
import Papa from 'papaparse';
import { SampleData } from './SampleData';

export interface CsvUploadProps {
  onUpload: (rawData: Record<string, string>[]) => void;
}

const CsvUpload = ({ onUpload }: CsvUploadProps) => {
  const { addNotification } = useContext(NotificationContext);

  const handleUpload = async (file: File) => {
    if (file.type !== 'text/csv') {
      addNotification({ message: 'The uploaded file should be a csv', variant: 'warn' }, 2000);
      return 'invalid';
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          addNotification({ variant: 'danger', message: 'An unknown error occurred when processing your csv' });
          return;
        }

        onUpload(results.data as any);
      },
      error: () => {
        addNotification({ variant: 'danger', message: 'An unknown error occurred when processing your csv' });
      },
    });

    return 'invalid';
  };

  const handleSampleData = () => {
    onUpload(SampleData);
  };

  return (
    <FocusLayout>
      <FileContext.Provider value={{ upload: handleUpload, getUrl: () => 'invalid' }}>
        <Heading>Upload a CSV..</Heading>
        <Spacer size='4x' />
        <ControlGroup>
          <Text>Currently only CSVs in the format exported by ING are supported.</Text>
          <ControlGroup.Spacer />
          <ImageUpload name='csv-file' />
          <ControlGroup.Spacer />
          <ControlGroup.Spacer />
          <ControlGroup.Spacer />
          <CenteredLayout>
            <Text>- OR -</Text>
          </CenteredLayout>
          <ControlGroup.Spacer />
          <ControlGroup.Spacer />
          <Button onClick={handleSampleData} variant='tertiary'>
            Use sample data
          </Button>
        </ControlGroup>
      </FileContext.Provider>
    </FocusLayout>
  );
};

export default CsvUpload;
