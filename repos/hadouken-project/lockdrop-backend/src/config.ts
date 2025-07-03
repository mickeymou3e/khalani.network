// config/config.env.ts

export default () => ({
  environment: process.env.NODE_ENV || 'testnet',
  totalHDK: 30000,
  chainMapping: {
    '0x118': 'zksync',
    '0x144': 'zksync',
    '0x1388': 'mantle',
    '0x1389': 'mantle',
    '0x116e9': 'godwoken',
    '0x116ea': 'godwoken',
  },
  chains: {
    testnet: {
      lockTokens: [
        '0x9904d25f1fd95a17fa90ad95901a9aede6952d85',
        '0x2F6fefD0f4df1c5aB36713398e246bf37D0C08a0',
        '0xf959629bdbdcac1e1d0a1ce630046db5cb6a15f2',
        '0x0aef038b4d8cf8d8e3f4ee4b1e0b582600debc2d',
        '0x0ffda3e96e98d070c910df6009f73a07c183adcb',
        '0xcfcf7db72bcf392bc6c8b4c66954e9595b8502d5',
      ],
      zksync: {
        lockTokens: [
          '0xf959629bdbdcac1e1d0a1ce630046db5cb6a15f2',
          '0x0aef038b4d8cf8d8e3f4ee4b1e0b582600debc2d',
        ],
        chainId: '0x118',
        subgraph:
          'https://graph-dev-http-hadouken-dev.hadouken.finance/subgraphs/name/balancer-zksync-testnet',
      },
      mantle: {
        lockTokens: [
          '0x0ffda3e96e98d070c910df6009f73a07c183adcb',
          '0xcfcf7db72bcf392bc6c8b4c66954e9595b8502d5',
        ],
        chainId: '0x1388',
        subgraph:
          'https://graph-dev-http-hadouken-dev.hadouken.finance/subgraphs/name/balancer-mantle-testnet',
      },
      godwoken: {
        lockTokens: [
          '0x9904d25f1fd95a17fa90ad95901a9aede6952d85',
          '0x2F6fefD0f4df1c5aB36713398e246bf37D0C08a0',
        ],
        chainId: '0x116e9',
        subgraph:
          'https://graph-dev-http-hadouken-dev.hadouken.finance/subgraphs/name/balancer-godwoken-testnet',
      },
    },
    mainnet: {
      lockTokens: ['0xa', '0xb'],
      zksync: {
        lockTokens: ['0xa', '0xb'],
        chainId: '0x144',
        subgraph:
          'https://graph-prod-http-hadouken-prod.hadouken.finance/subgraphs/name/balancer-zksync-mainnet',
      },
      mantle: {
        lockTokens: ['0xa', '0xb'],
        chainId: '0x1389',
        subgraph:
          'https://graph-prod-http-hadouken-prod.hadouken.finance/subgraphs/name/balancer-mantle-mainnet',
      },
      godwoken: {
        lockTokens: ['0xa', '0xb'],
        chainId: '0x116ea',
        subgraph:
          'https://graph-prod-http-hadouken-prod.hadouken.finance/subgraphs/name/balancer-godwoken-mainnet',
      },
    },
  },
});
