import { Button, MinimalMenu } from '@dtdot/lego';
import React, { useState } from 'react';

import UploadCsvModal from './UploadCsvModal';

const Header = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <MinimalMenu.Header
        rightContent={
          <div>
            <Button variant='primary' size='sm' onClick={handleOpen}>
              Upload CSV
            </Button>
          </div>
        }
      ></MinimalMenu.Header>
      <UploadCsvModal open={open} handleClose={handleClose} />
    </>
  );
};

export default Header;
