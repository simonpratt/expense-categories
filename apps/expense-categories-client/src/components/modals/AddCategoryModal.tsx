import React, { useState } from 'react';
import { Button, ControlGroup, Form, Input, Modal, Spacer, Text } from '@dtdot/lego';
import { apiConnector } from '../../core/api.connector';
import ColorPicker from './ColorPicker';

interface AddCategoryModalProps {
  handleClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ handleClose }) => {
  const { mutateAsync, isLoading } = apiConnector.app.categories.addCategory.useMutation();
  const [formValue, setFormValue] = useState({ name: '', colour: 'red' });

  const handleAddCategory = async () => {
    await mutateAsync(formValue);
    handleClose();
  };

  return (
    <Modal onClose={handleClose} loading={isLoading}>
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
            <Button loading={isLoading} onClick={handleAddCategory} data-testid='button-add'>
              Add Category
            </Button>
          </ControlGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddCategoryModal;
