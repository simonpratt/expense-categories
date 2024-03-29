import React from 'react';
import { BodyStyle, Themes } from '@dtdot/lego';
import { ThemeProvider } from 'styled-components';
import { NotificationProvider, Notifications } from '@dtdot/notifications';
import { DialoguesProvider } from '@dtdot/dialogues';

export interface RootProviderProps {
  children: React.ReactNode;
}

const RootProvider = ({ children }: RootProviderProps) => {
  return (
    <ThemeProvider theme={Themes.dark}>
      <NotificationProvider>
        <DialoguesProvider>
          <BodyStyle />
          <Notifications />
          {children}
        </DialoguesProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default RootProvider;
