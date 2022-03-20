import React, { useState } from 'react';
import HelperModalsContext from './HelperModals.context';
import InputModal, { InputModalProps } from './InputModal';

export interface HelperModalsProviderProps {
  children: React.ReactNode;
}

const HelperModalsProvider = ({ children }: HelperModalsProviderProps) => {
  const [inputModal, setInputModal] = useState<InputModalProps>();

  const requestInput = (message: string): Promise<string> => {
    return new Promise((resolve) => {
      setInputModal({
        message,
        onClose: () => setInputModal(undefined),
        onSubmit: resolve,
      });
    });
  };

  return (
    <>
      <HelperModalsContext.Provider value={{ requestInput }}>{children}</HelperModalsContext.Provider>

      {inputModal && (
        <InputModal message={inputModal.message} onClose={inputModal.onClose} onSubmit={inputModal.onSubmit} />
      )}
    </>
  );
};

export default HelperModalsProvider;
