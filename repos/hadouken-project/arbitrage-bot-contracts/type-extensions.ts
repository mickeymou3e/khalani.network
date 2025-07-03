import 'hardhat/types/config'

declare module 'hardhat/types/config' {
  interface ArbitrageSwapConfig {
    vaultAddress: string
    lendingPoolAddress: string
    pCKBAddress: string
    WCKBAddress: string
  }

  interface HardhatNetworkUserConfig {
    arbitrageSwapConfig: ArbitrageSwapConfig
  }

  interface HttpNetworkUserConfig {
    arbitrageSwapConfig: ArbitrageSwapConfig
  }

  interface HardhatNetworkConfig {
    arbitrageSwapConfig: ArbitrageSwapConfig
  }

  interface HttpNetworkConfig {
    arbitrageSwapConfig: ArbitrageSwapConfig
  }
}
