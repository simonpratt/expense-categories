import React from 'react';
import { Outlet } from 'react-router-dom';

import { MinimalMenu } from '@dtdot/lego';

import RootProvider from './RootProvider';
import Header from './components/core/Header';
import Menu from './components/core/Menu';

function App() {
  return (
    <RootProvider>
      <Menu />
      <MinimalMenu.Page>
        <Header />
        <Outlet />
      </MinimalMenu.Page>
    </RootProvider>
  );
}

export default App;
