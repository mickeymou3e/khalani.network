import { createConfig, http } from 'wagmi';
import { metaMask } from 'wagmi/connectors';

const bobSepolia = {
  id: 111, // Chain ID
  name: 'BOB Sepolia', // Network Name
  network: 'bobSepolia', // Network identifier (usually a lowercase, no-spaces version of the name)
  rpcUrls: {
    default: {
      http: ['https://testnet.rpc.gobob.xyz'], // New RPC URL
    },
  },
  nativeCurrency: {
    name: 'Ether', // Currency name
    symbol: 'ETH', // Currency symbol
    decimals: 18, // Currency decimals
  },
  blockExplorers: {
    default: { url: 'https://testnet-explorer.gobob.xyz/' }, // Block Explorer URL (optional)
  },
};

export const config = (createConfig as any)({
  chains: [bobSepolia],
  connectors: [metaMask()],
  transports: {
    [bobSepolia.id]: http(),
  },
});
