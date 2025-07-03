import { CallOverrides, providers, Signer } from "ethers";

export interface ScriptRunEnvironment {
  network: string,
  address: string,
  wallet: Signer,
  provider: providers.JsonRpcProvider,
  transactionOverrides: CallOverrides,
}

export interface CliProps {
  environment: ScriptRunEnvironment
  parentCli?: Cli
}

export type CliPropsExtended<ExtendedCliProps> = CliProps & ExtendedCliProps

export type Cli = CliProvider<CliProps, void>

export type CliProvider<PropsType, ReturnType> = (props: PropsType) => Promise<ReturnType>