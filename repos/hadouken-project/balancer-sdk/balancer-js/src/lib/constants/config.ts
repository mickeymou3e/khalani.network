import { Network } from './network';
import { BalancerNetworkConfig } from '@/types';

export const balancerVault = '0xBA12222222228d8Ba445958a75a0704d566BF2C8';

export const BALANCER_NETWORK_CONFIG: Record<Network, BalancerNetworkConfig> = {
  [Network.ZKSYNC_TESTNET]: {
    chainId: Network.ZKSYNC_TESTNET,
    addresses: {
      contracts: {
        vault: '0xF5E99BD85bCb0745458627F90a1f9eFaEA70f045',
        multicall: '0xEd056775B0Fb172e7F810b2B0f6F8E8C42244D93',
        balancerHelpers: '0x293bEd0ce5E828e0D6107085E885907FfffAAdeA',
      },
      tokens: {
        wrappedNativeAsset: '0x20b28B1e4665FFf290650586ad76E977EAb90c5D',
      },
    },
    urls: {
      subgraph:
        'https://graph-dev-http-hadouken-dev.hadouken.finance/subgraphs/name/balancer-zksync-testnet',
    },
    pools: {},
  },
  [Network.ZKSYNC_MAINNET]: {
    chainId: Network.ZKSYNC_MAINNET,
    addresses: {
      contracts: {
        vault: '0x0000000000000000000000000000000000000000',
        multicall: '0x0000000000000000000000000000000000000000',
        balancerHelpers: '0x0000000000000000000000000000000000000000',
      },
      tokens: {
        wrappedNativeAsset: '0x0000000000000000000000000000000000000000',
      },
    },
    urls: {
      subgraph: '',
    },
    pools: {},
  },
  [Network.MANTLE_TESTNET]: {
    chainId: Network.MANTLE_TESTNET,
    addresses: {
      contracts: {
        vault: '0x3dB6e78a866c69eb37090edB73a5FbEBa5B5DC98',
        multicall: '0xa81C417d1a53C40F78a9b72c2735A0f30B8cec2C',
        balancerHelpers: '0xe2c2fae22D684230AAA45D1d8ADE562883e087A4',
      },
      tokens: {
        wrappedNativeAsset: '0x0000000000000000000000000000000000000000',
      },
    },
    urls: {
      subgraph:
        'https://graph-dev-http-hadouken-dev.hadouken.finance/subgraphs/name/balancer-mantle-testnet',
    },
    pools: {},
  },
  [Network.MANTLE_MAINNET]: {
    chainId: Network.MANTLE_MAINNET,
    addresses: {
      contracts: {
        vault: '0x0000000000000000000000000000000000000000',
        multicall: '0x0000000000000000000000000000000000000000',
        balancerHelpers: '0x0000000000000000000000000000000000000000',
      },
      tokens: {
        wrappedNativeAsset: '0x0000000000000000000000000000000000000000',
      },
    },
    urls: {
      subgraph: '',
    },
    pools: {},
  },
  [Network.GODWOKEN_MAINNET]: {
    chainId: Network.GODWOKEN_MAINNET,
    addresses: {
      contracts: {
        vault: '0x4F8BDF24826EbcF649658147756115Ee867b7D63',
        multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
        balancerHelpers: '0x8d39E436F0e4821009C2ADb944A2bD72b0dBA575',
      },
      tokens: {
        wrappedNativeAsset: '0x7538c85cae4e4673253ffd2568c1f1b48a71558a',
      },
    },
    urls: {
      subgraph:
        'https://graph-prod-http-hadouken-prod.hadouken.finance/subgraphs/name/balancer-godwoken-mainnet',
    },
    pools: {},
  },
  [Network.GODWOKEN_TESTNET]: {
    chainId: Network.GODWOKEN_TESTNET,
    addresses: {
      contracts: {
        vault: '0x84B73B0f766dD97E9e05fa8702229819DE9cC13D',
        multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
        balancerHelpers: '0xB9544A3d5f572778e520d5E580651C40E6AC0eA1',
      },
      tokens: {
        wrappedNativeAsset: '0x0eb76790a2014Dd1F65488Ccd703bCDF75F8195e',
      },
    },
    urls: {
      subgraph:
        'https://graph-dev-http-hadouken-dev.hadouken.finance/subgraphs/name/balancer-godwoken-testnet',
    },
    pools: {},
  },
  [Network.MAINNET]: {
    chainId: Network.MAINNET, //1
    addresses: {
      contracts: {
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
        multicall: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
        balancerHelpers: '0x5aDDCCa35b7A0D07C74063c48700C8590E87864E',
        lidoRelayer: '0xdcdbf71A870cc60C6F9B621E28a7D3Ffd6Dd4965',
        relayerV3: '0x886A3Ec7bcC508B8795990B60Fa21f85F9dB7948',
        relayerV4: '0x2536dfeeCB7A0397CF98eDaDA8486254533b1aFA',
        gaugeController: '0xc128468b7ce63ea702c1f104d55a2566b13d3abd',
        feeDistributor: '0xD3cf852898b21fc233251427c2DC93d3d604F3BB',
        protocolFeePercentagesProvider:
          '0x97207B095e4D5C9a6e4cfbfcd2C3358E03B90c4A',
        veBal: '0xC128a9954e6c874eA3d62ce62B468bA073093F25',
        veBalProxy: '0x6f5a2eE11E7a772AeB5114A20d0D7c0ff61EB8A0',
        weightedPoolFactory: '0x8E9aa87E45e92bad84D5F8DD1bff34Fb92637dE9',
        composableStablePoolFactory:
          '0x85a80afee867adf27b50bdb7b76da70f1e853062',
      },
      tokens: {
        wrappedNativeAsset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        lbpRaisingTokens: [
          '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        ],
        stETH: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
        wstETH: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
        bal: '0xba100000625a3754423978a60c9317c58a424e3d',
        veBal: '0xC128a9954e6c874eA3d62ce62B468bA073093F25',
        bbaUsd: '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb2',
      },
    },
    urls: {
      subgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
      gaugesSubgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges',
      blockNumberSubgraph:
        'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
    },
    pools: {
      wETHwstETH: {
        id: '0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080',
        address: '0x32296969ef14eb0c6d29669c550d4a0449130230',
      },
    },
    poolsToIgnore: [
      '0xbd482ffb3e6e50dc1c437557c3bea2b68f3683ee', // a pool made by an external dev who was playing with a novel rate provider mechanism in production.
    ],
    sorConnectingTokens: [
      {
        symbol: 'wEth',
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      },
      {
        symbol: 'wstEth',
        address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
      },
      {
        symbol: 'DOLA',
        address: '0x865377367054516e17014CcdED1e7d814EDC9ce4',
      },
    ],
  },
  [Network.POLYGON]: {
    chainId: Network.POLYGON, //137
    addresses: {
      contracts: {
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
        multicall: '0xa1B2b503959aedD81512C37e9dce48164ec6a94d',
        relayerV3: '0xcf6a66E32dCa0e26AcC3426b851FD8aCbF12Dac7',
        relayerV4: '0x28A224d9d398a1eBB7BA69BCA515898966Bb1B6b',
        balancerHelpers: '0x239e55F427D44C3cc793f49bFB507ebe76638a2b',
        weightedPoolFactory: '0x0e39C3D9b2ec765eFd9c5c70BB290B1fCD8536E3',
        composableStablePoolFactory:
          '0x85a80afee867adf27b50bdb7b76da70f1e853062',
      },
      tokens: {
        bal: '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3',
        wrappedNativeAsset: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      },
    },
    urls: {
      subgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-prune-v2',
      gaugesSubgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges-polygon',
      blockNumberSubgraph:
        'https://api.thegraph.com/subgraphs/name/ianlapham/polygon-blocks',
    },
    pools: {},
    poolsToIgnore: [
      '0x600bd01b6526611079e12e1ff93aba7a3e34226f', // This pool has rateProviders with incorrect scaling
    ],
    sorConnectingTokens: [
      {
        symbol: 'weth',
        address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      },
      {
        symbol: 'bbrz2',
        address: '0xe22483774bd8611be2ad2f4194078dac9159f4ba',
      }, // Joins Stables<>BRZ via https://app.balancer.fi/#/polygon/pool/0x4a0b73f0d13ff6d43e304a174697e3d5cfd310a400020000000000000000091c
    ],
  },
  [Network.ARBITRUM]: {
    chainId: Network.ARBITRUM, //42161
    addresses: {
      contracts: {
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
        multicall: '0x269ff446d9892c9e19082564df3f5e8741e190a1',
        relayerV3: '0x42E49B48573c725ee32d2579060Ed06894f97002',
        relayerV4: '0x5bf3B7c14b10f16939d63Bd679264A1Aa951B4D5',
        balancerHelpers: '0x77d46184d22CA6a3726a2F500c776767b6A3d6Ab',
        weightedPoolFactory: '0x8df6EfEc5547e31B0eb7d1291B511FF8a2bf987c',
        composableStablePoolFactory:
          '0x85a80afee867adf27b50bdb7b76da70f1e853062',
      },
      tokens: {
        bal: '0x040d1edc9569d4bab2d15287dc5a4f10f56a56b8',
        wrappedNativeAsset: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      },
    },
    urls: {
      subgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-arbitrum-v2',
      gaugesSubgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges-arbitrum',
      blockNumberSubgraph:
        'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-one-blocks',
    },
    pools: {},
    sorConnectingTokens: [
      {
        symbol: 'weth',
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      },
    ],
  },
  [Network.KOVAN]: {
    chainId: Network.KOVAN, //42
    addresses: {
      contracts: {
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
        multicall: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
        veBal: '0x16ba924752EF283C7946db8A122a6742AA35C1DC',
        veBalProxy: '0x98D0d0a65cBeCCaa647a5a95cf27Cf2f00E1231C',
        balancerHelpers: '0x94905e703fEAd7f0fD0eEe355D267eE909784e6d',
        weightedPoolFactory: '0x8df6EfEc5547e31B0eb7d1291B511FF8a2bf987c',
      },
      tokens: {
        wrappedNativeAsset: '0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1',
      },
    },
    urls: {
      subgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-kovan-v2',
      gaugesSubgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges',
    },
    pools: {},
  },
  [Network.ROPSTEN]: {
    chainId: Network.ROPSTEN, //3
    addresses: {
      contracts: {
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
        multicall: '0x53c43764255c17bd724f74c4ef150724ac50a3ed',
        balancerHelpers: '',
      },
      tokens: {
        wrappedNativeAsset: '0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1',
      },
    },
    urls: {
      subgraph: '',
      gaugesSubgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges',
    },
    pools: {},
  },
  [Network.RINKEBY]: {
    chainId: Network.RINKEBY, //4
    addresses: {
      contracts: {
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
        multicall: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
        balancerHelpers: '0x5aDDCCa35b7A0D07C74063c48700C8590E87864E',
        weightedPoolFactory: '0x8df6EfEc5547e31B0eb7d1291B511FF8a2bf987c',
      },
      tokens: {
        wrappedNativeAsset: '0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1',
      },
    },
    urls: {
      subgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-rinkeby-v2',
      gaugesSubgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges',
    },
    pools: {},
  },
  [Network.GOERLI]: {
    chainId: Network.GOERLI, //5
    addresses: {
      contracts: {
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
        multicall: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
        relayerV3: '0x7b9B6f094DC2Bd1c12024b0D9CC63d6993Be1888',
        relayerV4: '0x00e695aA8000df01B8DC8401B4C34Fba5D56BBb2',
        gaugeController: '0xBB1CE49b16d55A1f2c6e88102f32144C7334B116',
        veBal: '0x33A99Dcc4C85C014cf12626959111D5898bbCAbF',
        veBalProxy: '0xA1F107D1cD709514AE8A914eCB757E95f9cedB31',
        balancerHelpers: '0x5aDDCCa35b7A0D07C74063c48700C8590E87864E',
        weightedPoolFactory: '0x8E9aa87E45e92bad84D5F8DD1bff34Fb92637dE9',
        composableStablePoolFactory:
          '0x85a80afee867adf27b50bdb7b76da70f1e853062',
      },
      tokens: {
        wrappedNativeAsset: '0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1',
      },
    },
    urls: {
      subgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-goerli-v2',
      gaugesSubgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges-goerli',
      blockNumberSubgraph:
        'https://api.thegraph.com/subgraphs/name/blocklytics/goerli-blocks',
    },
    pools: {},
    sorConnectingTokens: [
      {
        symbol: 'weth',
        address: '0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1',
      },
    ],
  },
  [Network.OPTIMISM]: {
    chainId: Network.OPTIMISM, //10
    addresses: {
      contracts: {
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
        multicall: '0x2dc0e2aa608532da689e89e237df582b783e552c',
        relayerV3: '0x195CcCBE464EF9073d1f7A1ba1C9Bf0f56dfFFff',
        relayerV4: '0x1a58897Ab366082028ced3740900ecBD765Af738',
        balancerHelpers: '0x8E9aa87E45e92bad84D5F8DD1bff34Fb92637dE9',
        weightedPoolFactory: '0x0e39C3D9b2ec765eFd9c5c70BB290B1fCD8536E3',
        composableStablePoolFactory:
          '0x85a80afee867adf27b50bdb7b76da70f1e853062',
      },
      tokens: {
        wrappedNativeAsset: '0x4200000000000000000000000000000000000006',
      },
    },
    urls: {
      subgraph:
        'https://api.thegraph.com/subgraphs/name/beethovenxfi/beethovenx-optimism',
      gaugesSubgraph: '',
    },
    pools: {},
    sorConnectingTokens: [
      {
        symbol: 'weth',
        address: '0x4200000000000000000000000000000000000006',
      },
    ],
  },
  [Network.GNOSIS]: {
    chainId: Network.GNOSIS, //100
    addresses: {
      contracts: {
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
        multicall: '0xbb6fab6b627947dae0a75808250d8b2652952cb5',
        relayerV4: '0xeF606F58A4FD0fCcb066c6203d0994694d3eB2D3',
        balancerHelpers: '0x8E9aa87E45e92bad84D5F8DD1bff34Fb92637dE9',
        weightedPoolFactory: '0xf302f9F50958c5593770FDf4d4812309fF77414f',
        composableStablePoolFactory:
          '0x76578ecf9a141296ec657847fb45b0585bcda3a6',
      },
      tokens: {
        wrappedNativeAsset: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
      },
    },
    urls: {
      subgraph:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gnosis-chain-v2',
      gaugesSubgraph: '',
    },
    pools: {},
    sorConnectingTokens: [
      {
        symbol: 'weth',
        address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
      },
    ],
  },
};

export const networkAddresses = (
  chainId: number
): BalancerNetworkConfig['addresses'] =>
  BALANCER_NETWORK_CONFIG[chainId as Network].addresses;
