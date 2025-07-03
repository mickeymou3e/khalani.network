import '@testing-library/jest-dom'
import { KHALA_SYMBOL } from '@tvl-labs/sdk'
import ConfigSchemaSdk from '@tvl-labs/sdk/dist/config/config.schema.json'

import ConfigSchema from './config/config.schema.json'

jest.mock('@config', () => {
  const defaultConfig: typeof ConfigSchema & typeof ConfigSchemaSdk = {
    contracts: {
      Vault: '0x580d2aa4231E4C2EFfb3A43D3b778cd956C875bf',
      AddressBalances: '0x9D025259bf0197105AB4482807Fa83ba0D4346f2',
      PoolsHelpers: '0x83b1c864D364b7E277a5218a950ab3887d80044d',
      NexusDiamond: '0xA1eF34B0bEdD89Be33385a5be37C9B3C08b47b1e',
      InterchainLiquidityHub: '0x60dF39C70D80A4ABDAdfcfCf13D20B38CfeCB440',
      ReceiptManager: '',
      MTokenCrossChainAdapter: '',
      MTokenManager: '',
      DiamondProxy: {
        '0xa869': '0x74f7532b774e055B4F2f413ddb76AA30b4687bf0',
        '0x4268': '0x1089Fa8b3e08972e6ad149BA900c9dB6Ee984E90',
      },
      AssetReserves: {
        '0xa869': '0xb574419eDF8AB976A3F72723E58Aa57c90fF7a7c',
        '0x4268': '0x723C29118a1c4b91a0BF1a1c085AdAa920A1ec8a',
      },
      eventVerifier: {},
      LibEncode: '0x29aad50db9EFAee498dC7bA8ce9Da2c4651cD942',
      SafeAdapter: '0x29c3468182d5b64ADDcE572D1b6Da3A99dB2c144',
      safe: {
        signMessageLibAddress: '0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2',
        safeProxyFactoryAddress: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
        safeMasterCopyAddress: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
        multiSendAddress: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
        fallbackHandlerAddress: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
        multiSendCallOnlyAddress: '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D',
        createCallAddress: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        simulateTxAccessorAddress: '0x59AD6735bCd8152B84860Cb256dD9e96b85F69Da',
      },
      hyperlaneAdapter: {},
      InterchainGasPaymaster: {},
      lending: {
        adminContract: '0xDE15f799375143F607ce9E8BBEe882A59431E021',
        borrowerOperations: '0x9e2f97CDD30Fbe8997112a3E767b7786b27f1aD4',
        feeCollector: '0xe060b4001890a76351f3ab129E34a0DbB3aCE1aa',
        priceFeed: '0x7E71245c50c94cd230DdE03d8F4C2f6f89f912d3',
        vesselManager: '0x22F1F5473B4783a79C50c6A66F5a20D518630E62',
      },
      permit2: {},
      SwapIntentBook: '',
      intentBookHelper: '',
      IntentBook: '',
      MTokenRegistry: '',
      multiCall: '',
    },
    intents: {
      subgraph: {},
    },
    tokens: [
      {
        id: 'cbcba4dc-6afb-40c3-8500-109ffcd11186',
        address: '0x91FB270bEDfBCd92E212DB460AeF1BE5aa3C17C4',
        decimals: 18,
        name: 'USDC | eth',
        symbol: 'USDC.eth',
        chainId: '0xaa36a7',
        sourceChainId: '',
      },
      {
        id: 'abc36e83-f6e2-4784-9f17-aff8b2cd1bbd',
        address: '0xda14B47643112D599f7116116Be44e376dcB8559',
        decimals: 18,
        name: KHALA_SYMBOL,
        symbol: KHALA_SYMBOL,
        chainId: '0xaa36a7',
        sourceChainId: '',
      },
      {
        id: '575d335b-d450-47c6-82f4-1d917f07de99',
        address: '0x65059A3cBB709eD815F0d2e6853D1787e4a73cbc',
        decimals: 18,
        name: 'USDC | avax',
        symbol: 'USDC.avax',
        chainId: '0xa869',
        sourceChainId: '',
      },
      {
        id: 'cfd10c21-895d-429f-b085-59a523aa3652',
        address: '0x6C214FCFFC5F9184300bD95ea1322F78BA189642',
        decimals: 18,
        name: KHALA_SYMBOL,
        symbol: KHALA_SYMBOL,
        chainId: '0xa869',
        sourceChainId: '',
      },
      {
        id: 'bec1ef38-2bea-4a0a-90a6-ac30b67270f2',
        address: '0x91FB270bEDfBCd92E212DB460AeF1BE5aa3C17C4',
        decimals: 18,
        name: 'USDC | avax',
        symbol: 'USDC.avax',
        chainId: '0x41786f6e',
        sourceChainId: '0xa869',
      },
      {
        id: '1807bb88-b1da-4a18-914e-179396101ea4',
        address: '0xa889D68e5522bAb2c48deBAf7D8466a7ACccCc93',
        decimals: 18,
        name: 'USDC | eth',
        symbol: 'USDC.eth',
        chainId: '0x41786f6e',
        sourceChainId: '0xaa36a7',
      },
      {
        id: 'b4211722-ac35-4822-8f4c-be3c7b5f9c1f',
        address: '0xc641563e76C4bB268d76751Af52c46c814BaBf05',
        decimals: 18,
        name: KHALA_SYMBOL,
        symbol: KHALA_SYMBOL,
        chainId: '0x41786f6e',
        sourceChainId: '',
      },
    ],
    mTokens: [],
    supportedChains: [
      {
        id: 11155111,
        chainName: 'Ethereum Sepolia',
        chainId: '0xaa36a7',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: ['https://sepolia.etherscan.io'],
        rpcUrls: ['https://rpc.sepolia.org'],
        logo: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg',
        borderColor: '#808080',
        poolTokenSymbols: ['USDT.eth', 'USDC.eth'],
        isBalancerChain: false,
      },
      {
        id: 43113,
        chainName: 'Avalanche Testnet',
        chainId: '0xa869',
        nativeCurrency: {
          name: 'AVAX',
          symbol: 'AVAX',
          decimals: 18,
        },
        blockExplorerUrls: ['https://testnet.snowtrace.io'],
        rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
        logo: 'https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg',
        borderColor: '#CC3333',
        poolTokenSymbols: ['USDT.avax', 'USDC.avax'],
        isBalancerChain: false,
      },
      {
        id: 10012,
        chainName: 'Khalani',
        chainId: '0x41786f6e',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: ['https://v1.betanet.gwscan.com/'],
        rpcUrls: ['https://www.axon-node.info'],
        logo: 'https://pbs.twimg.com/media/FdWhUExUUAE30t_.png',
        borderColor: '#228c22',
        poolTokenSymbols: [],
        isBalancerChain: true,
      },
    ],
    supportedPools: [],
    api: {
      dia: {
        priceUrl: 'https://api.diadata.org/v1/quotation',
      },
    },
    explorer: {
      blockExplorer: {},
      subgraph: {},
    },
    explorerUrl: 'https://cross-chain-explorer.staging.khalani.network',
    faucetUrl: '',
    discordUrl: '',
    twitterUrl: '',
    wcProjectId: '',
    medusa: {
      apiUrl: '',
      wsUrl: '',
    },
    workerUrl: '',
    hyperlane: {
      subgraph: {},
    },
    solver: '0x0000000000000000000000000000000000000000',
  }

  return {
    __esModule: true,
    default: defaultConfig,
    getBalancerChain: jest.fn(() =>
      defaultConfig.supportedChains.find((i) => i.chainName === 'Khalani'),
    ),
  }
})

jest.mock('@config/')

const spy = jest.spyOn(console, 'error')
spy.mockImplementation(() => ({}))

jest.setTimeout(15000)

process.env.TYPE = 'staging'
