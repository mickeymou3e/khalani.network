import '@testing-library/jest-dom'

import ConfigSchema from './config/config.schema.json'

jest.mock('@config', (): typeof ConfigSchema => {
  return {
    hadouken: {
      lending: {
        url: 'https://beta-lending.hadouken.finance',
      },
      bridge: {
        url: 'https://beta-bridge.hadouken.finance',
      },
    },
    godwoken: {
      chainName: 'Godwoken Testnet',
      chainId: '0x116e1',
      nativeCurrency: {
        name: 'CKB',
        symbol: 'CKB',
        decimals: 8,
      },
      type: 'godwoken',
      rpcUrl: 'https://godwoken-testnet-v1.ckbapp.dev',
      wsUrl: 'wss://godwoken-testnet-v1.ckbapp.dev/ws',
      explorerUrl: 'https://v1.betanet.gwscan.com/',
    },
    nervos: {
      env: 'testnet',
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
    subgraph: {
      httpUri: {
        balancer:
          'https://axon-indexer-testnet.digipnyx.org/subgraphs/name/balancer-v2-3',
        tokens:
          'https://axon-indexer-testnet.digipnyx.org/subgraphs/name/balancer-v2-3',
      },
      webSocketUri: {
        balancer:
          'wss://axon-indexer-testnet-ws.digipnyx.org/subgraphs/name/balancer-v2-3',
        tokens:
          'wss://axon-indexer-testnet-ws.digipnyx.org/subgraphs/name/balancer-v2-3',
      },
    },
    subgraphs: {
      balancer: {
        httpUri:
          'https://axon-indexer-testnet.digipnyx.org/subgraphs/name/balancer-v2-fork-1',
        webSocketUri:
          'wss://axon-indexer-testnet-ws.digipnyx.org/subgraphs/name/balancer-v2-fork-1',
      },
      blocks: {
        httpUri:
          'https://axon-indexer-testnet.digipnyx.org/subgraphs/name/blocks',
        webSocketUri:
          'wss://axon-indexer-testnet-ws.digipnyx.org/subgraphs/name/blocks',
      },
    },
    explorerUrl: {
      ckb: 'https://explorer.nervos.org/aggron/address/',
      godwoken: 'https://aggron.layerview.io/account/',
      ethereum: 'https://rinkeby.etherscan.io/address/',
    },
    contracts: {
      Vault: '0xA30910BddCe9e141ce3aF22069cac56a1a940b19',
      AddressBalances: '0xA8B7D00F6a7f106e43226103EAb0DAe6c690cb21',
      PoolsHelpers: '0x1a75aA4Ff224EFC95ba1FEe2989B7e2AF55355aF',
      Oracle: '0x96C5F1E50c4393EFa890699cD9AeCf3FB58dcB99',
      CrossChainRouter: {
        '0x5': '0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5',
      },
      USDT: '0x10A86c9C8CbE7cf2849bfCb0EaBE39b3bFEc91D4',
      USDC: '0x630AcC0A29E325ce022563Df69ba7E25Eeb1e184',
      DAI: '0xA2370D7aFFf03e1E2FB77b28Fb65532636e0cB61',
      ETH: '0xf0d66bf1260D21fE90329A7A311e84979FEB004d',
      WBTC: '0x6935a6841bbBDb7430acc1906188301F3044FB76',
      CKB: '0xE05d380839f32bC12Fb690aa6FE26B00Bd982613',
      BNB: '0xFB60eBF591bc5e363A24b67518339F0015Ad02eE',
      TRICRYPTO: '0x0b55b2f3f622723f8df20c1fa4e60325d6734bd1',
      WBTCUSDT: '0x5c4dda3d4941b5d28a541064859a947f3a836b07',
      BNBUSDC: '0x6f516cf7b351ff3985bd3737800920495a00512d',
      TWOPOOL: '0x7435412d4baf1cddce79bc4191ebaf7805daf81b',
      USDCCKB: '0x7ad0f3c13553f934fc59789312b2df58c91a9771',
      TWOPOOLDAI: '0xaa9a5bb4c91bbf2e6d92a322d1615e6a6bab1e9d',
      CKBETHUSDC: '0xb79c38bbbeb57fc3f9b4cb56c84fa9458f60b14b',
      ETHUSDC: '0x91b5860c9943AA516C8904fd9cBB7d28cc64198f',
      hUSDC: '0x9c36c4a22181be78300f0c6ff93a96f756912410',
      hUSDT: '0xf927ed99999ec9e38531a19976f97bcb112bd9b1',
      'hb-a-USDC': '0x0f040828d6af2fb00843d4119f71e9cbdcc2e85b',
      'hb-a-USDT': '0x55ac28751e750b90636b193d91d81afb40ff49e3',
    },
    api: {
      dia: {
        priceUrl: 'https://api.diadata.org/v1/quotation',
      },
    },
  }
})

const spy = jest.spyOn(console, 'error')
spy.mockImplementation(() => ({}))

process.env.CONFIG = 'axon'
