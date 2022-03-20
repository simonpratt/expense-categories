import React from 'react';
import { BodyStyle, Themes } from '@dtdot/lego';
import { ThemeProvider } from 'styled-components';
import { NotificationProvider, Notifications } from '@dtdot/notifications';
import HelperModalsProvider from './external/HelperModals/HelperModals.provider';

export interface RootProviderProps {
  children: React.ReactNode;
}

const RootProvider = ({ children }: RootProviderProps) => {
  return (
    <ThemeProvider theme={Themes.dark}>
      <NotificationProvider>
        <HelperModalsProvider>
          <BodyStyle />
          <Notifications />
          {children}
        </HelperModalsProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default RootProvider;
