import { Button, Modal, Spacer, Text } from '@dtdot/lego';
import styled from 'styled-components';

const ButtonDiv = styled.div`
  display: flex;
  justify-content: flex-end;

  & > * {
    margin-left: 8px;
  }
`;

export interface ConfirmationModalProps {
  heading: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal = ({ heading, message, onClose, onConfirm }: ConfirmationModalProps) => {
  return (
    <Modal onClose={onClose}>
      <Modal.Header header={heading || 'Input Required'} />
      <Modal.Body>
        <Text>{message}</Text>
        <Spacer size='2x' />
        <ButtonDiv>
          <Button variant='secondary' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='primary' onClick={onConfirm}>
            Ok
          </Button>
        </ButtonDiv>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmationModal;
