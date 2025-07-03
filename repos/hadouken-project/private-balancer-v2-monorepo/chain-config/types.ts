export type ChainConfig = {
  env: string;
  network: string;
  delay: string;
  chainId: string;
  marketId: string;
  gasPrice: number;
  gasLimit: number;
  rpcUrl: string;
  readOnlyRpcUrl: string;
  wsUrl: string;
  explorer: string;
};

export type ChainConfigWithDeployer = ChainConfig & { deployer: string };
