import { BigNumber, Overrides } from 'ethers';
import { Signer } from 'ethers';

export type Deployer = Signer;
export interface ScriptRunEnvironment {
  deployer: Deployer;
  transactionOverrides: Overrides;
  network: string;
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

export type ChainPrices = {
  husd: BigNumber;
  triCrypto: BigNumber;
};

export type Cli = (props: CliProps) => Promise<void>;
