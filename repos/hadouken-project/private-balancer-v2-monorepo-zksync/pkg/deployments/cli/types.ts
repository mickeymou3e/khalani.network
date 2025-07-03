import { Overrides } from 'ethers';
import { Signer } from 'ethers';
import { Network } from '../src/types';
import { Wallet as ZkSyncWallet } from 'ethers';

export type Deployer = Signer | ZkSyncWallet;
export interface ScriptRunEnvironment {
  network: Network;
  deployer: Deployer;
  transactionOverrides: Overrides;
  chainId: string;
}

export interface CliProps {
  environment: ScriptRunEnvironment;
  parentCli?: Cli;
}

export interface Output<ContractInput, ContractOutput> {
  transaction: {
    hash: string;
    blockNumber: number | undefined;
  };
  data: {
    [key: string]: {
      [key: string]: {
        input: ContractInput;
        output: ContractOutput;
        additional?: {
          [key: string]: string;
        };
      };
    };
  };
}

export type Cli = (props: CliProps) => Promise<void>;
