
export interface DaoDeploymentData {
  ERC20HDK: string;
  VotingEscrow: string;
  GaugeController: string;
  PoolProxy: string;
  Minter: string;
  LiquidityGauge: { [key: string]: string };
  LiquidityGaugeReward: { [key: string]: string };
}