import { Button, ControlLine, MinimalMenu } from '@dtdot/lego';
import React, { useState } from 'react';

import UploadCsvModal from '../modals/UploadCsvModal';
import DateRangeSelect from './DateRangeSelect';

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <MinimalMenu.Header
        size='md'
        rightContent={
          <ControlLine>
            <DateRangeSelect />
            <Button variant='primary' onClick={handleOpen}>
              Upload CSV
            </Button>
          </ControlLine>
        }
      ></MinimalMenu.Header>
      {open && <UploadCsvModal onClose={handleClose} />}
    </>
  );
};

export default Header;
