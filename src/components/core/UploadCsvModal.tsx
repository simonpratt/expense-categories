import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import Papa from 'papaparse';

interface UploadCsvModalProps {
  open: boolean;
  handleClose: () => void;
}

const UploadCsvModal: React.FC<UploadCsvModalProps> = ({ open, handleClose }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          console.log(results.data);
        },
      });
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant='h6' component='h2'>
          Upload CSV File
        </Typography>
        <input type='file' accept='.csv' onChange={handleFileUpload} />
      </Box>
    </Modal>
  );
};

export default UploadCsvModal;
