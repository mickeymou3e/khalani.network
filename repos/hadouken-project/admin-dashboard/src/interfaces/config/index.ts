export type AppEnvironment =
  | 'godwoken-mainnet'
  | 'godwoken-testnet'
  | 'zksync-mainnet'
  | 'zksync-testnet'
  | 'mantle-mainnet'
  | 'mantle-testnet'

export type AppConfig = {
  chain: string
  appName: string
  contractsEnv: string
  contracts: {
    liquidator: string | null
    diaOracle: string | null
    bandOracle: string | null
    treasury: string | null
    protocolFeeCollector: string | null
  }
  subgraph: {
    httpUri: string
    webSocketUri: string
  }
  nativeToken: {
    address: string
    symbol: string
  }
}
