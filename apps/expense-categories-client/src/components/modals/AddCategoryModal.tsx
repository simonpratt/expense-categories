import React, { useState } from 'react';
import { Button, ControlGroup, Form, Input, Modal, Spacer, Text } from '@dtdot/lego';
import { apiConnector } from '../../core/api.connector';
import ColorPicker from './ColorPicker';

interface AddCategoryModalProps {
  onClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onClose }) => {
  const { mutateAsync, isLoading } = apiConnector.app.categories.addCategory.useMutation();
  const [formValue, setFormValue] = useState({ name: '', colour: 'red' });
  const utils = apiConnector.useUtils();

  const handleAddCategory = async () => {
    await mutateAsync(formValue);
    utils.invalidate('app.categories.getCategories' as any);
    onClose();
  };

  return (
    <Modal onClose={onClose} loading={isLoading}>
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
