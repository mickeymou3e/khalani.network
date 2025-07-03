type PrioritizedSwapPair = {
  [chainId: string]: {
    baseToken: string
    quoteToken: string
  }
}

type LockDropTokens = Record<
  string,
  {
    TriCrypto: string
    BoostedUSD: string
    PriceToken: string
    Hdk: string
    Pool: string
  }
>

export interface FrontConfig {
  defaultChainId: string
  supportedNetworks: string[]
  nativeCurrencies: Record<string, string>
  prioritizedSwapPairs: PrioritizedSwapPair
  lockDropTokens: LockDropTokens
  lockdropBackend: string
}

export interface Config {
  hadouken: {
    lending: {
      url: string
    }
    bridge: {
      url: string
    }
  }
  sentry: string
  chainName: string
  chainId: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
    address: string
    wrapAddress: string | null
  }
  rpcUrl: string
  readOnlyRpcUrl: string
  wsUrl: string
  env: string
  nervos?: {
    ckb: {
      url: string
    }
    indexer: {
      url: string
    }
    rollup_type_hash: string
    rollup_type_script: {
      code_hash: string
      hash_type: string
      args: string
    }
    eth_account_lock_hash: string
    deposit_lock_script_type_hash: string
    portal_wallet_lock_hash: string
    rc_lock_script_type_hash: string
  }
  subgraphs: {
    balancer: {
      httpUri: string
      webSocketUri: string
    }
  }
  explorerUrl: {
    ckb?: string
    godwoken: string
    ethereum: string
  }
  api: {
    dia: {
      priceUrl: string
    }
  }
  customLinearPools: string[]
}
