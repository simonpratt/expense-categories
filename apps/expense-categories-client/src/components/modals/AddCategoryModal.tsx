import React, { useState } from 'react';
import { Modal } from '@dtdot/lego';
import { apiConnector } from '../../core/api.connector';
import ColorPicker from './ColorPicker';

interface AddCategoryModalProps {
  handleClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ handleClose }) => {
  const { mutateAsync, isLoading } = apiConnector.app.categories.addCategory.useMutation();
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState('red');

  const handleAddCategory = async () => {
    await mutateAsync({ name: categoryName, colour: categoryColor });
    handleClose();
  };

  return (
    <Modal onClose={handleClose} loading={isLoading}>
      <Modal.Body>
        <div>
          <label>
            Category Name:
            <input type='text' value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
          </label>
        </div>
        <div>
          <div>
            <label>Category Color:</label>
            <ColorPicker selectedColor={categoryColor} onSelectColor={setCategoryColor} />
          </div>
        </div>
        <button onClick={handleAddCategory}>Add Category</button>
      </Modal.Body>
    </Modal>
  );
};

export default AddCategoryModal;
