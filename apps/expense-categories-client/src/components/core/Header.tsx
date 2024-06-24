import { Button, MinimalMenu } from '@dtdot/lego';
import React, { useState } from 'react';

import UploadCsvModal from '../modals/UploadCsvModal';
import DateRangeSelect from './DateRangeSelect';
import styled from 'styled-components';

const ControlContainer = styled.div`
  display: flex;
`;

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <MinimalMenu.Header
        rightContent={
          <ControlContainer>
            <DateRangeSelect />
            <Button variant='primary' onClick={handleOpen}>
              Upload CSV
            </Button>
          </ControlContainer>
        }
      ></MinimalMenu.Header>
      {open && <UploadCsvModal onClose={handleClose} />}
    </>
  );
};

export default Header;
