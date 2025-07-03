import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Overrides, Wallet, providers } from "ethers";

export type Deployer = SignerWithAddress | Wallet;
export type Environments =
  | "godwoken-mainnet"
  | "godwoken-testnet"
  | "zksync-testnet"
  | "zksync-mainnet"
  | "mantle-testnet";

export interface ScriptRunEnvironment {
  env: Environments;
  address: string;
  deployer: Deployer;
  provider: providers.JsonRpcProvider;
  transactionOverrides: Overrides;
}

export interface Config {
  env: string;
  deployer?: string;
  gasPrice?: number;
  gasLimit?: number;
  isGnosisSafe?: boolean;
  chainId: string;
  rpcUrl: string;
  subgraphAddress: string;
  gnosisSafe?: string;
  gnosisApi?: string;
  contracts: {
    swap: {
      vault: string;
      balancerHelpers: string;
      triCryptoPool: string;
      ckbPools: string[];
      ethPools: string[];
      usdPools: string[];
    };
    lending: {
      lendingPool: string;
    };
    tokens: {
      [key: string]: {
        address: string;
        aTokenAddress?: string;
      };
    };
  };
}

export interface IContractsConfig {
  backstop: string;
  liquidation: string;
}

export interface CliProps {
  environment: ScriptRunEnvironment;
  parentCli?: Cli;
}

export type Cli = (props: CliProps) => Promise<void>;

export enum Contract {
  Backstop,
  Balancer,
}

export enum BackstopActions {
  deposit,
  withdraw,
  canLiquidate,
  liquidate,
  getLiquidation,
  setLiquidation,
  getOwner,
  setOwner,
  getLiquidationParams,
}

export enum BalancerActions {
  querySwap,
  queryJoin,
  queryExit,
  checkInternalBalances,
  getPoolTokens,
}
