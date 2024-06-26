import React, { useState } from 'react';

import { Button, ControlGroup, Form, Input, Modal, Spacer, Text, TextArea } from '@dtdot/lego';

import { apiConnector } from '../../core/api.connector';
import { SpendingCategory } from '../../core/api.types';
import ColorPicker from './ColorPicker';

interface EditCategoryModalProps {
  category: SpendingCategory;
  onClose: () => void;
  onInvalidateData: () => void;
}

interface FormProps {
  name: string;
  colour: string;
  description: string;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ category, onClose, onInvalidateData }) => {
  const { mutateAsync, isPending } = apiConnector.app.categories.updateCategory.useMutation();
  const [formValue, setFormValue] = useState<FormProps>({ ...category, description: category.description || '' });

  const handleSaveCategory = async () => {
    await mutateAsync({ id: category.id, ...formValue });
    onInvalidateData();
    onClose();
  };

  return (
    <Modal onClose={onClose} loading={isPending}>
      <Modal.Header header='Edit Category' />
      <Modal.Body>
        <Form value={formValue} onChange={setFormValue}>
          <ControlGroup variation='comfortable'>
            <Input name='name' label='Name' />
            <TextArea name='description' label='Description' />
            <div>
              <Text>Colour</Text>
              <Spacer size='1x' />
              <ColorPicker
                selectedColor={formValue.colour}
                onSelectColor={(colour) => setFormValue({ ...formValue, colour })}
              />
            </div>
            <Button loading={isPending} onClick={handleSaveCategory} data-testid='button-save'>
              Save Category
            </Button>
          </ControlGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditCategoryModal;
