import React from 'react';
import logo from './logo.svg';
import './App.css';
import WalletConnect from './components/WalletConnect';
import { WagmiProvider } from 'wagmi';
import { config } from './wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Orders from './components/Orders';
import PlaceOrder from './components/PlaceOrder';

function App() {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletConnect />
        <PlaceOrder />
        <Orders />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
