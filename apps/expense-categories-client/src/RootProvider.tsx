import React from 'react';

import { DialoguesProvider } from '@dtdot/dialogues';
import { BodyStyle, Themes } from '@dtdot/lego';
import { NotificationProvider, Notifications } from '@dtdot/notifications';

import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider } from 'styled-components';

import DateRangeProvider from './components/core/DateRangeProvider';
import { TRPCProvider } from './core/tRPC.provider';

export interface RootProviderProps {
  children: React.ReactNode;
}

const theme = createTheme({
  palette: {
    primary: {
      main: Themes.dark.colours.primary.main,
      contrastText: Themes.dark.colours.primary.contrastText,
    },
    success: {
      main: Themes.dark.colours.statusSuccess.main,
      contrastText: Themes.dark.colours.statusSuccess.contrast,
    },
    info: {
      main: Themes.dark.colours.statusInfo.main,
      contrastText: Themes.dark.colours.statusInfo.contrast,
    },
    warning: {
      main: Themes.dark.colours.statusWarn.main,
      contrastText: Themes.dark.colours.statusWarn.contrast,
    },
    error: {
      main: Themes.dark.colours.statusDanger.main,
      contrastText: Themes.dark.colours.statusDanger.contrast,
    },
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
              <DateRangeProvider>
                <BodyStyle />
                <Notifications />
                {children}
              </DateRangeProvider>
            </DialoguesProvider>
          </NotificationProvider>
        </TRPCProvider>
      </MuiThemeProvider>
    </ThemeProvider>
  );
};

export default RootProvider;
