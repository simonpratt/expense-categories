import React from 'react';
import { BodyStyle, Themes } from '@dtdot/lego';
import { ThemeProvider } from 'styled-components';

export interface RootProviderProps {
  children: React.ReactNode;
}

const RootProvider = ({ children }: RootProviderProps) => {
  return (
    <ThemeProvider theme={Themes.dark}>
      <BodyStyle />
      {children}
    </ThemeProvider>
  );
};

export default RootProvider;
