import { defineChain } from 'viem';
import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';

export const bobSepolia = defineChain({
  id: 111,
  name: 'BOB Sepolia',
  network: 'bob-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'BOB Sepolia',
    symbol: 'ETH'
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.rpc.gobob.xyz']
    },
    public: {
      http: ['https://testnet.rpc.gobob.xyz']
    }
  },
  blockExplorers: {
    default: {
      name: 'BOB Sepolia Explorer',
      url: 'https://testnet-explorer.gobob.xyz'
    }
  },
  contracts: {
    multicall3: {
      address: '0x089b191d95417817389c8eD9075b51a38ca46DE8',
      blockCreated: 2469044
    }
  },
  testnet: true
});

export const config = createConfig({
  chains: [bobSepolia],
  connectors: [injected()],
  transports: {
    [bobSepolia.id]: http()
  }
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
