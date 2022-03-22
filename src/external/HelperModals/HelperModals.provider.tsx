import React, { useState } from 'react';
import ConfirmationModal, { ConfirmationModalProps } from './ConfirmationModal';
import HelperModalsContext from './HelperModals.context';
import InputModal, { InputModalProps } from './InputModal';

export interface HelperModalsProviderProps {
  children: React.ReactNode;
}

const HelperModalsProvider = ({ children }: HelperModalsProviderProps) => {
  const [inputModal, setInputModal] = useState<InputModalProps>();
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalProps>();

  const requestConfirmation = (heading: string, message: string): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setConfirmationModal({
        heading,
        message,
        onClose: () => {
          setConfirmationModal(undefined);
          resolve(false);
        },
        onConfirm: () => resolve(true),
      });
    });
  };

  const requestInput = (heading: string): Promise<string | undefined> => {
    return new Promise<string | undefined>((resolve) => {
      setInputModal({
        heading,
        onClose: () => {
          setInputModal(undefined);
          resolve(undefined);
        },
        onSubmit: resolve,
      });
    });
  };

  return (
    <>
      <HelperModalsContext.Provider value={{ requestInput, requestConfirmation }}>
        {children}
      </HelperModalsContext.Provider>

      {inputModal && (
        <InputModal heading={inputModal.heading} onClose={inputModal.onClose} onSubmit={inputModal.onSubmit} />
      )}

      {confirmationModal && (
        <ConfirmationModal
          heading={confirmationModal.heading}
          message={confirmationModal.message}
          onClose={confirmationModal.onClose}
          onConfirm={confirmationModal.onConfirm}
        />
      )}
    </>
  );
};

export default HelperModalsProvider;
