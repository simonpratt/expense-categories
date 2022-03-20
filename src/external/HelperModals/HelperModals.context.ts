import { createContext } from 'react';

export interface HelperModalsContextProps {
  requestInput: (message: string) => Promise<string>;
}

const HelperModalsContext = createContext<HelperModalsContextProps>({
  // eslint-disable-next-line
  requestInput: (message: string) => { throw new Error('ERROR: Upload function must be bound in a context'); },
});

export default HelperModalsContext;
