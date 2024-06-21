import React, { useState } from 'react';
import { Button, ControlGroup, Form, Input, Modal, Spacer, Text } from '@dtdot/lego';
import { apiConnector } from '../../core/api.connector';
import ColorPicker from './ColorPicker';

interface AddCategoryModalProps {
  onClose: () => void;
  onInvalidateData: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onClose, onInvalidateData }) => {
  const { mutateAsync, isPending } = apiConnector.app.categories.addCategory.useMutation();
  const [formValue, setFormValue] = useState({ name: '', colour: 'red' });

  const handleAddCategory = async () => {
    await mutateAsync(formValue);
    onInvalidateData();
    onClose();
  };

  return (
    <Modal onClose={onClose} loading={isPending}>
      <Modal.Header header='Add Category' />
      <Modal.Body>
        <Form value={formValue} onChange={setFormValue}>
          <ControlGroup variation='comfortable'>
            <Input name='name' label='Name' />
            <div>
              <Text>Colour</Text>
              <Spacer size='1x' />
              <ColorPicker
                selectedColor={formValue.colour}
                onSelectColor={(colour) => setFormValue({ ...formValue, colour })}
              />
            </div>
            <Button loading={isPending} onClick={handleAddCategory} data-testid='button-add'>
              Add Category
            </Button>
          </ControlGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddCategoryModal;
