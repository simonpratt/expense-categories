import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import App from './App';
import Categorise from './components/categorise/Categorise';
import Analyse from './components/analyse/Analyse';

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
        element: <Analyse startDate='2024-01-01' />,
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
