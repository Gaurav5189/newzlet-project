import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import './styles/globals.css';
import './styles/typography.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered stale after 4 minutes.
      // Combined with the 5-min backend cache_page TTL, returning
      // mobile users (window focus) will always see articles that are
      // at most ~9 minutes old — not 24 hours old.
      staleTime: 4 * 60 * 1000,
      // Refetch in the background whenever the user returns to the tab.
      // This is the key fix for mobile Chrome: when you switch apps and
      // come back, a background refetch fires automatically.
      refetchOnWindowFocus: true,
      // Also refetch when the device reconnects to the internet.
      refetchOnReconnect: true,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
