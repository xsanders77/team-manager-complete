import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * QueryContext - Stellt den React Query Provider für die Anwendung bereit
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} QueryContext Provider
 */
export const QueryProvider = ({ children }) => {
  // QueryClient mit Standardkonfiguration erstellen
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 Minuten
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;
