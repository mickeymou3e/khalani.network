import "hardhat/types/config"

declare module "hardhat/types/config" {
  interface HardhatNetworkUserConfig {
    vaultAddress: string
  }

  interface HttpNetworkUserConfig {
    vaultAddress: string
  }

  interface HardhatNetworkConfig {
    vaultAddress: string
  }

  interface HttpNetworkConfig {
    vaultAddress: string
  }
}
