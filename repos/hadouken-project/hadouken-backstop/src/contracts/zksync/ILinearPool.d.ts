/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface ILinearPoolInterface extends ethers.utils.Interface {
  functions: {
    "getScalingFactors()": FunctionFragment;
    "getSwapFeePercentage()": FunctionFragment;
    "getTargets()": FunctionFragment;
    "getVirtualSupply()": FunctionFragment;
    "totalSupply()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getScalingFactors",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSwapFeePercentage",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTargets",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getVirtualSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "getScalingFactors",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSwapFeePercentage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getTargets", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getVirtualSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;

  events: {};
}

export class ILinearPool extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: ILinearPoolInterface;

  functions: {
    getScalingFactors(overrides?: CallOverrides): Promise<[BigNumber[]]>;

    getSwapFeePercentage(overrides?: CallOverrides): Promise<[BigNumber]>;

    getTargets(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        lowerTarget: BigNumber;
        upperTarget: BigNumber;
      }
    >;

    getVirtualSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  getScalingFactors(overrides?: CallOverrides): Promise<BigNumber[]>;

  getSwapFeePercentage(overrides?: CallOverrides): Promise<BigNumber>;

  getTargets(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { lowerTarget: BigNumber; upperTarget: BigNumber }
  >;

  getVirtualSupply(overrides?: CallOverrides): Promise<BigNumber>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    getScalingFactors(overrides?: CallOverrides): Promise<BigNumber[]>;

    getSwapFeePercentage(overrides?: CallOverrides): Promise<BigNumber>;

    getTargets(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        lowerTarget: BigNumber;
        upperTarget: BigNumber;
      }
    >;

    getVirtualSupply(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    getScalingFactors(overrides?: CallOverrides): Promise<BigNumber>;

    getSwapFeePercentage(overrides?: CallOverrides): Promise<BigNumber>;

    getTargets(overrides?: CallOverrides): Promise<BigNumber>;

    getVirtualSupply(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getScalingFactors(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getSwapFeePercentage(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTargets(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getVirtualSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
