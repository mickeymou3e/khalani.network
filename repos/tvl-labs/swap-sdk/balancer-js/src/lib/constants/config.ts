import { Network } from './network';
import { BalancerNetworkConfig } from '@/types';

export const balancerVault = '0xd69FAC6C632eF023afCe7471Bda724b228237570';

export const BALANCER_NETWORK_CONFIG: Record<Network, BalancerNetworkConfig> = {
  [Network.KHALANI_TESTNET]: {
    chainId: Network.KHALANI_TESTNET,
    addresses: {
      contracts: {
        vault: '0x580d2aa4231E4C2EFfb3A43D3b778cd956C875bf',
        multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
      tokens: {
        wrappedNativeAsset: '0x0eb76790a2014Dd1F65488Ccd703bCDF75F8195e',
      },
    },
    urls: {
      subgraph:
        'https://graph-node-http-khalani.testnet.khalani.network/subgraphs/name/balancer-khalani',
    },
    thirdParty: {
      coingecko: {
        nativeAssetId: 'eth',
        platformId: 'ethereum',
      },
    },
    pools: {},
    sorTriPathMidPoolIds: [
      '0xbdb2ade29dd506c115b6afc761862e2070e966fe000000000000000000000006',
    ],
  },
};

export const networkAddresses = (
  chainId: number
): BalancerNetworkConfig['addresses'] =>
  BALANCER_NETWORK_CONFIG[chainId as Network].addresses;
