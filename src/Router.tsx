import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import App from './App';

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
        element: <div>categorise!</div>,
      },
      {
        path: '/analyse',
        element: <div>analyse!</div>,
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
