'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; 
import { Suspense, lazy, useEffect, useState } from 'react';

const ReactQueryDevtoolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
);

export default function QueryClientProviderComponent({ children }) {
  const [queryClient] = useState(() => new QueryClient({  // Initialize only once
    defaultOptions: {
      queries: {
        staleTime: Infinity, // Set default stale time for all queries
      },
    },
  }));

  const [showDevtools, setShowDevtools] = useState(false);

  useEffect(() => {
    // Toggle devtools via window
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen />
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}