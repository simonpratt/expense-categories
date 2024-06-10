import RootProvider from './RootProvider';
import { Outlet } from 'react-router-dom';
import Menu from './components/core/Menu';
import { MinimalMenu } from '@dtdot/lego';
import Header from './components/core/Header';
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
