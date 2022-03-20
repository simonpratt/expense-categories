import { ActionLayout, FileContext, ImageUpload } from '@dtdot/lego';
import { NotificationContext } from '@dtdot/notifications';
import React, { useContext } from 'react';

export interface CsvUploadProps {
  onUpload: (file: File) => void;
}

const CsvUpload = ({ onUpload }: CsvUploadProps) => {
  const { addNotification } = useContext(NotificationContext);

  const handleUpload = async (file: File) => {
    if (file.type !== 'text/csv') {
      addNotification({ message: 'The uploaded file should be a csv', variant: 'warn' }, 2000);
      return 'invalid';
    }

    onUpload(file);
    return 'invalid';
  };

  return (
    <ActionLayout>
      <FileContext.Provider value={{ upload: handleUpload, getUrl: () => 'invalid' }}>
        <ImageUpload name='csv-file' />
      </FileContext.Provider>
    </ActionLayout>
  );
};

export default CsvUpload;
