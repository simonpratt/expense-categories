import React, { useState } from 'react';
import { Modal } from '@dtdot/lego';
import { apiConnector } from '../../core/api.connector';
import { colorMapping } from '../../core/colorMapping';

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
          <label>
            Category Color:
            <select value={categoryColor} onChange={(e) => setCategoryColor(e.target.value)}>
              {Object.keys(colorMapping).map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button onClick={handleAddCategory}>Add Category</button>
      </Modal.Body>
    </Modal>
  );
};

export default AddCategoryModal;
