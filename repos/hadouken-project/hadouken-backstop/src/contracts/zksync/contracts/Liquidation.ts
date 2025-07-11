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
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface LiquidationInterface extends utils.Interface {
  functions: {
    "_ckbPools(uint256)": FunctionFragment;
    "_ethPools(uint256)": FunctionFragment;
    "_lendingPool()": FunctionFragment;
    "_poolIds(uint256)": FunctionFragment;
    "_triCryptoPool()": FunctionFragment;
    "_triCryptoPoolId()": FunctionFragment;
    "_triCryptoPoolTokens(uint256)": FunctionFragment;
    "_usdPools(uint256)": FunctionFragment;
    "_vault()": FunctionFragment;
    "getAllPools()": FunctionFragment;
    "getTriCryptoPoolTokens()": FunctionFragment;
    "liquidate(address,address,address,uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "_ckbPools"
      | "_ethPools"
      | "_lendingPool"
      | "_poolIds"
      | "_triCryptoPool"
      | "_triCryptoPoolId"
      | "_triCryptoPoolTokens"
      | "_usdPools"
      | "_vault"
      | "getAllPools"
      | "getTriCryptoPoolTokens"
      | "liquidate"
      | "owner"
      | "renounceOwnership"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "_ckbPools",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "_ethPools",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "_lendingPool",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "_poolIds",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "_triCryptoPool",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "_triCryptoPoolId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "_triCryptoPoolTokens",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "_usdPools",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "_vault", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getAllPools",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTriCryptoPoolTokens",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "liquidate",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "_ckbPools", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "_ethPools", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "_lendingPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "_poolIds", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "_triCryptoPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_triCryptoPoolId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_triCryptoPoolTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "_usdPools", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "_vault", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAllPools",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTriCryptoPoolTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "liquidate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface Liquidation extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: LiquidationInterface;

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
    _ckbPools(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    _ethPools(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    _lendingPool(overrides?: CallOverrides): Promise<[string]>;

    _poolIds(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    _triCryptoPool(overrides?: CallOverrides): Promise<[string]>;

    _triCryptoPoolId(overrides?: CallOverrides): Promise<[string]>;

    _triCryptoPoolTokens(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    _usdPools(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    _vault(overrides?: CallOverrides): Promise<[string]>;

    getAllPools(
      overrides?: CallOverrides
    ): Promise<
      [string[], string[], string[]] & {
        ckbPools: string[];
        ethPools: string[];
        usdPools: string[];
      }
    >;

    getTriCryptoPoolTokens(overrides?: CallOverrides): Promise<[string[]]>;

    liquidate(
      debtToken: PromiseOrValue<string>,
      collateralToken: PromiseOrValue<string>,
      user: PromiseOrValue<string>,
      repayAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  _ckbPools(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  _ethPools(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  _lendingPool(overrides?: CallOverrides): Promise<string>;

  _poolIds(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  _triCryptoPool(overrides?: CallOverrides): Promise<string>;

  _triCryptoPoolId(overrides?: CallOverrides): Promise<string>;

  _triCryptoPoolTokens(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  _usdPools(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  _vault(overrides?: CallOverrides): Promise<string>;

  getAllPools(
    overrides?: CallOverrides
  ): Promise<
    [string[], string[], string[]] & {
      ckbPools: string[];
      ethPools: string[];
      usdPools: string[];
    }
  >;

  getTriCryptoPoolTokens(overrides?: CallOverrides): Promise<string[]>;

  liquidate(
    debtToken: PromiseOrValue<string>,
    collateralToken: PromiseOrValue<string>,
    user: PromiseOrValue<string>,
    repayAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    _ckbPools(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    _ethPools(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    _lendingPool(overrides?: CallOverrides): Promise<string>;

    _poolIds(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    _triCryptoPool(overrides?: CallOverrides): Promise<string>;

    _triCryptoPoolId(overrides?: CallOverrides): Promise<string>;

    _triCryptoPoolTokens(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    _usdPools(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    _vault(overrides?: CallOverrides): Promise<string>;

    getAllPools(
      overrides?: CallOverrides
    ): Promise<
      [string[], string[], string[]] & {
        ckbPools: string[];
        ethPools: string[];
        usdPools: string[];
      }
    >;

    getTriCryptoPoolTokens(overrides?: CallOverrides): Promise<string[]>;

    liquidate(
      debtToken: PromiseOrValue<string>,
      collateralToken: PromiseOrValue<string>,
      user: PromiseOrValue<string>,
      repayAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    _ckbPools(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    _ethPools(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    _lendingPool(overrides?: CallOverrides): Promise<BigNumber>;

    _poolIds(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    _triCryptoPool(overrides?: CallOverrides): Promise<BigNumber>;

    _triCryptoPoolId(overrides?: CallOverrides): Promise<BigNumber>;

    _triCryptoPoolTokens(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    _usdPools(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    _vault(overrides?: CallOverrides): Promise<BigNumber>;

    getAllPools(overrides?: CallOverrides): Promise<BigNumber>;

    getTriCryptoPoolTokens(overrides?: CallOverrides): Promise<BigNumber>;

    liquidate(
      debtToken: PromiseOrValue<string>,
      collateralToken: PromiseOrValue<string>,
      user: PromiseOrValue<string>,
      repayAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    _ckbPools(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    _ethPools(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    _lendingPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    _poolIds(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    _triCryptoPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    _triCryptoPoolId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    _triCryptoPoolTokens(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    _usdPools(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    _vault(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getAllPools(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTriCryptoPoolTokens(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    liquidate(
      debtToken: PromiseOrValue<string>,
      collateralToken: PromiseOrValue<string>,
      user: PromiseOrValue<string>,
      repayAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
