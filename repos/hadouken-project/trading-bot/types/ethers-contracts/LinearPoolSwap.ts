/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface LinearPoolSwapInterface extends utils.Interface {
  functions: {
    "balancePool(uint256)": FunctionFragment;
    "checkIfPoolIsOutsideRange(uint256)": FunctionFragment;
    "executeOperation(address[],uint256[],uint256[],address,bytes)": FunctionFragment;
    "flashLoanUnwind(uint8,uint256)": FunctionFragment;
    "flashLoanWind(uint8,uint256)": FunctionFragment;
    "getBalancingOperation(uint256)": FunctionFragment;
    "unwindXTimes(uint8,uint256)": FunctionFragment;
    "windXTimes(uint8,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "balancePool"
      | "checkIfPoolIsOutsideRange"
      | "executeOperation"
      | "flashLoanUnwind"
      | "flashLoanWind"
      | "getBalancingOperation"
      | "unwindXTimes"
      | "windXTimes"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "balancePool",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "checkIfPoolIsOutsideRange",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "executeOperation",
    values: [
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "flashLoanUnwind",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "flashLoanWind",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getBalancingOperation",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "unwindXTimes",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "windXTimes",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "balancePool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "checkIfPoolIsOutsideRange",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeOperation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "flashLoanUnwind",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "flashLoanWind",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBalancingOperation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unwindXTimes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "windXTimes", data: BytesLike): Result;

  events: {};
}

export interface LinearPoolSwap extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: LinearPoolSwapInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    balancePool(
      threshold: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    checkIfPoolIsOutsideRange(
      threshold: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    executeOperation(
      assets: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      premiums: PromiseOrValue<BigNumberish>[],
      initiator: PromiseOrValue<string>,
      params: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    flashLoanUnwind(
      counter: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    flashLoanWind(
      counter: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getBalancingOperation(
      threshold: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[number, BigNumber] & { operation: number; amount: BigNumber }>;

    unwindXTimes(
      counter: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    windXTimes(
      counter: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  balancePool(
    threshold: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  checkIfPoolIsOutsideRange(
    threshold: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  executeOperation(
    assets: PromiseOrValue<string>[],
    amounts: PromiseOrValue<BigNumberish>[],
    premiums: PromiseOrValue<BigNumberish>[],
    initiator: PromiseOrValue<string>,
    params: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  flashLoanUnwind(
    counter: PromiseOrValue<BigNumberish>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  flashLoanWind(
    counter: PromiseOrValue<BigNumberish>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getBalancingOperation(
    threshold: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<[number, BigNumber] & { operation: number; amount: BigNumber }>;

  unwindXTimes(
    counter: PromiseOrValue<BigNumberish>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  windXTimes(
    counter: PromiseOrValue<BigNumberish>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    balancePool(
      threshold: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    checkIfPoolIsOutsideRange(
      threshold: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    executeOperation(
      assets: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      premiums: PromiseOrValue<BigNumberish>[],
      initiator: PromiseOrValue<string>,
      params: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    flashLoanUnwind(
      counter: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    flashLoanWind(
      counter: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getBalancingOperation(
      threshold: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[number, BigNumber] & { operation: number; amount: BigNumber }>;

    unwindXTimes(
      counter: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    windXTimes(
      counter: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    balancePool(
      threshold: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    checkIfPoolIsOutsideRange(
      threshold: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    executeOperation(
      assets: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      premiums: PromiseOrValue<BigNumberish>[],
      initiator: PromiseOrValue<string>,
      params: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    flashLoanUnwind(
      counter: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    flashLoanWind(
      counter: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getBalancingOperation(
      threshold: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    unwindXTimes(
      counter: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    windXTimes(
      counter: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    balancePool(
      threshold: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    checkIfPoolIsOutsideRange(
      threshold: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    executeOperation(
      assets: PromiseOrValue<string>[],
      amounts: PromiseOrValue<BigNumberish>[],
      premiums: PromiseOrValue<BigNumberish>[],
      initiator: PromiseOrValue<string>,
      params: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    flashLoanUnwind(
      counter: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    flashLoanWind(
      counter: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getBalancingOperation(
      threshold: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    unwindXTimes(
      counter: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    windXTimes(
      counter: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
