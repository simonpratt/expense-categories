import React from 'react';
import { BodyStyle, Themes } from '@dtdot/lego';
import { ThemeProvider } from 'styled-components';
import { NotificationProvider, Notifications } from '@dtdot/notifications';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { DialoguesProvider } from '@dtdot/dialogues';
import { TRPCProvider } from './core/tRPC.provider';

export interface RootProviderProps {
  children: React.ReactNode;
}

const theme = createTheme({
  palette: {
    text: {
      primary: Themes.dark.colours.defaultFont,
      secondary: Themes.dark.colours.secondaryFont,
    },
    background: {
      paper: Themes.dark.colours.cardBackground,
    },
    action: {
      focus: Themes.dark.colours.controlBorderFocus,
      hover: Themes.dark.colours.controlBorderHover,
    },
  },
});

const RootProvider = ({ children }: RootProviderProps) => {
  return (
    <ThemeProvider theme={Themes.dark}>
      <MuiThemeProvider theme={theme}>
        <TRPCProvider>
          <NotificationProvider>
            <DialoguesProvider>
              <BodyStyle />
              <Notifications />
              {children}
            </DialoguesProvider>
          </NotificationProvider>
        </TRPCProvider>
      </MuiThemeProvider>
    </ThemeProvider>
  );
};

export default RootProvider;
