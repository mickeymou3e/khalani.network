import '@testing-library/jest-dom'

import { Config } from './src/config.types'

jest.mock(
  '@config',
  (): Config => {
    return {
      hadouken: {
        lending: {
          url: 'https://beta-lending.hadouken.finance',
        },
        bridge: {
          url: 'https://beta-bridge.hadouken.finance',
        },
      },
      sentry: '',
      chainName: 'Godwoken Testnet',
      chainId: '0x116e1',
      nativeCurrency: {
        name: 'CKB',
        symbol: 'CKB',
        decimals: 8,
        address: '0xE05d380839f32bC12Fb690aa6FE26B00Bd982613',
        wrapAddress: null,
      },
      rpcUrl: 'https://godwoken-testnet-v1.ckbapp.dev',
      readOnlyRpcUrl: 'https://godwoken-testnet-v1.ckbapp.dev',
      wsUrl: 'wss://godwoken-testnet-v1.ckbapp.dev/ws',
      env: 'testnet',
      nervos: {
        ckb: {
          url: 'https://testnet.ckb.dev',
        },
        indexer: {
          url: 'https://indexer-testnet.ckb.tools',
        },
        rollup_type_hash:
          '0x702359ea7f073558921eb50d8c1c77e92f760c8f8656bde4995f26b8963e2dd8',
        rollup_type_script: {
          code_hash:
            '0x1e44736436b406f8e48a30dfbddcf044feb0c9eebfe63b0f81cb5bb727d84854',
          hash_type: 'type',
          args:
            '0x86c7429247beba7ddd6e4361bcdfc0510b0b644131e2afb7e486375249a01802',
        },
        eth_account_lock_hash:
          '0x07521d0aa8e66ef441ebc31204d86bb23fc83e9edc58c19dbb1b0ebe64336ec0',
        deposit_lock_script_type_hash:
          '0x50704b84ecb4c4b12b43c7acb260ddd69171c21b4c0ba15f3c469b7d143f6f18',
        portal_wallet_lock_hash:
          '0x58c5f491aba6d61678b7cf7edf4910b1f5e00ec0cde2f42e0abb4fd9aff25a63',
        rc_lock_script_type_hash:
          '0x79f90bb5e892d80dd213439eeab551120eb417678824f282b4ffb5f21bad2e1e',
      },
      subgraphs: {
        balancer: {
          httpUri:
            'https://graph-node-http-hadouken.rumblefish.dev/subgraphs/name/release-0_0_1',
          webSocketUri:
            'wss://graph-node-ws-hadouken.rumblefish.dev/subgraphs/name/release-0_0_1',
        },
      },
      explorerUrl: {
        ckb: 'https://explorer.nervos.org/aggron/address/',
        godwoken: 'https://aggron.layerview.io/account/',
        ethereum: 'https://rinkeby.etherscan.io/address/',
      },
      api: {
        dia: {
          priceUrl: 'https://api.diadata.org/v1/quotation',
        },
      },
      customLinearPools: [],
    }
  },
)

process.env = Object.assign(process.env, {
  CONFIG: 'testnet',
})

const spy = jest.spyOn(console, 'error')
spy.mockImplementation(() => ({}))
