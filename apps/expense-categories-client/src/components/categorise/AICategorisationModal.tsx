import React from 'react';
import { Modal } from '@dtdot/lego';
import { apiConnector } from '../../core/api.connector';
import { SpendingCategory } from '../../core/api.types';

interface AICategorisationModalProps {
  category: SpendingCategory;
  handleClose: () => void;
}

const AICategorisationModal: React.FC<AICategorisationModalProps> = ({ category, handleClose }) => {
  const { data } = apiConnector.app.assist.getRecommendations.useQuery(
    { spendingCategoryId: category.id },
    {
      refetchOnWindowFocus: false,
    },
  );

  return (
    <Modal onClose={handleClose} loading={!data}>
      <Modal.Header header='Add Category' />
      <Modal.Body>
        {data?.map((row) => (
          <div key={row.id}>
            {row.description} ({row.confidence}) ({row.totalDebit}) ({row.totalFrequency})
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default AICategorisationModal;
