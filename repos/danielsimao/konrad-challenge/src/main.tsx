import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CSSReset, InterlayUIProvider } from '@interlay/ui';
import { bobTheme } from '@interlay/theme';
import { Buffer } from 'buffer';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiProvider } from 'wagmi';

import App from './App.tsx';
import { config } from './wagmi';

import './index.css';

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <InterlayUIProvider theme={bobTheme}>
          <CSSReset />
          <App />
        </InterlayUIProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
