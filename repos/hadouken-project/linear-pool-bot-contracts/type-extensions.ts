import "hardhat/types/config";

declare module "hardhat/types/config" {
  interface LinearPoolSwapConfig {
    vaultAddress: string;
    lendingPoolAddress: string;
    tokenAddress: string;
    wrappedHTokenAddress: string;
    poolId: string;
    linearPoolAddress: string;
  }

  interface HardhatNetworkUserConfig {
    linearPoolSwapConfigs: LinearPoolSwapConfig[];
  }

  interface HttpNetworkUserConfig {
    linearPoolSwapConfigs: LinearPoolSwapConfig[];
  }

  interface HardhatNetworkConfig {
    linearPoolSwapConfigs: LinearPoolSwapConfig[];
  }

  interface HttpNetworkConfig {
    linearPoolSwapConfigs: LinearPoolSwapConfig[];
  }
}
