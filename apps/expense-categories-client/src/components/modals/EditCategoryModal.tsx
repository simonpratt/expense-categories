import React, { useState } from 'react';
import { Button, ControlGroup, Form, Input, Modal, Spacer, Text } from '@dtdot/lego';
import { apiConnector } from '../../core/api.connector';
import ColorPicker from './ColorPicker';
import { SpendingCategory } from '../../core/api.types';

interface EditCategoryModalProps {
  handleClose: () => void;
  category: SpendingCategory;
}

interface FormProps {
  name: string;
  colour: string;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ category, handleClose }) => {
  const { mutateAsync, isLoading } = apiConnector.app.categories.updateCategory.useMutation();
  const [formValue, setFormValue] = useState<FormProps>(category);
  const utils = apiConnector.useUtils();

  const handleAddCategory = async () => {
    await mutateAsync({ id: category.id, ...formValue });
    utils.invalidate('app.categories.getCategories' as any);
    handleClose();
  };

  return (
    <Modal onClose={handleClose} loading={isLoading}>
      <Modal.Header header='Edit Category' />
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
            <Button loading={isLoading} onClick={handleAddCategory} data-testid='button-save'>
              Save Category
            </Button>
          </ControlGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditCategoryModal;
