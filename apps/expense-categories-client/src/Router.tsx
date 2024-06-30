import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import App from './App';
import Analyse from './components/analyse/Analyse';
import Categorise from './components/categorise/Categorise';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Navigate to='/categorise' replace={true} />,
      },
      {
        path: '/categorise',
        element: <Categorise />,
      },
      {
        path: '/analyse',
        element: <Analyse />,
      },
      {
        path: '*',
        element: <Navigate to='/categorise' replace={true} />,
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
