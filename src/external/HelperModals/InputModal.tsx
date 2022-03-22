import { Button, ControlGroup, Form, Input, Modal } from '@dtdot/lego';
import { useState } from 'react';

export interface InputModalProps {
  heading: string;
  onClose: () => void;
  onSubmit: (val: string) => void;
}

const InputModal = ({ heading, onClose, onSubmit }: InputModalProps) => {
  const [value, setValue] = useState({ name: '' });

  const _onSubmitClicked = () => {
    onSubmit(value.name);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <Modal.Header header={heading || 'Input Required'} />
      <Modal.Body>
        <Form value={value} onChange={setValue}>
          <ControlGroup variation='submission'>
            <Input autoFocus name='name' />
            <Button type='submit' onClick={_onSubmitClicked}>
              Ok
            </Button>
          </ControlGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default InputModal;
