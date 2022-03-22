import { createContext } from 'react';

export interface HelperModalsContextProps {
  requestConfirmation: (heading: string, message: string) => Promise<boolean>;
  requestInput: (heading: string) => Promise<string | undefined>;
}

const HelperModalsContext = createContext<HelperModalsContextProps>({
  // eslint-disable-next-line
  requestConfirmation: (heading: string) => { throw new Error('ERROR: requestConfirmation function must be bound in a context'); },
  // eslint-disable-next-line
  requestInput: (heading: string) => { throw new Error('ERROR: requestInput function must be bound in a context'); },
});

export default HelperModalsContext;
