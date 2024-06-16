import React from 'react';
import { BodyStyle, Themes } from '@dtdot/lego';
import { ThemeProvider } from 'styled-components';
import { NotificationProvider, Notifications } from '@dtdot/notifications';
import { DialoguesProvider } from '@dtdot/dialogues';
import { TRPCProvider } from './core/tRPC.provider';

export interface RootProviderProps {
  children: React.ReactNode;
}

const RootProvider = ({ children }: RootProviderProps) => {
  return (
    <ThemeProvider theme={Themes.dark}>
      <TRPCProvider>
        <NotificationProvider>
          <DialoguesProvider>
            <BodyStyle />
            <Notifications />
            {children}
          </DialoguesProvider>
        </NotificationProvider>
      </TRPCProvider>
    </ThemeProvider>
  );
};

export default RootProvider;
