import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
                color: '#ffffff',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -3px rgba(15, 15, 18, 0.4), 0 4px 6px -2px rgba(251, 191, 36, 0.05)',
              },
              success: {
                style: {
                  background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
                  color: '#ffffff',
                  border: '1px solid rgba(251, 191, 36, 0.6)',
                },
                iconTheme: {
                  primary: '#fbbf24',
                  secondary: '#18181b',
                },
              },
              error: {
                style: {
                  background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
                  color: '#ffffff',
                  border: '1px solid rgba(220, 38, 38, 0.6)',
                },
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#18181b',
                },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
); 