import React, { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';

import { apiConnector } from './api.connector';
import environment from './environment';

export interface TRPCProviderProps {
  children: React.ReactNode;
}

export function TRPCProvider({ children }: TRPCProviderProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    apiConnector.createClient({
      links: [
        httpBatchLink({
          url: environment.VITE_API_URL,
        }),
      ],
    }),
  );
  return (
    <apiConnector.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </apiConnector.Provider>
  );
}
