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
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface MinterInterface extends ethers.utils.Interface {
  functions: {
    "mint(address)": FunctionFragment;
    "mint_many(address[8])": FunctionFragment;
    "mint_for(address,address)": FunctionFragment;
    "toggle_approve_mint(address)": FunctionFragment;
    "token()": FunctionFragment;
    "controller()": FunctionFragment;
    "minted(address,address)": FunctionFragment;
    "allowed_to_mint_for(address,address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "mint", values: [string]): string;
  encodeFunctionData(
    functionFragment: "mint_many",
    values: [[string, string, string, string, string, string, string, string]]
  ): string;
  encodeFunctionData(
    functionFragment: "mint_for",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "toggle_approve_mint",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "controller",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "minted",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "allowed_to_mint_for",
    values: [string, string]
  ): string;

  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mint_many", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mint_for", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "toggle_approve_mint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "controller", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "minted", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "allowed_to_mint_for",
    data: BytesLike
  ): Result;

  events: {
    "Minted(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Minted"): EventFragment;
}

export class Minter extends Contract {
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

  interface: MinterInterface;

  functions: {
    mint(
      gauge_addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "mint(address)"(
      gauge_addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    mint_many(
      gauge_addrs: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "mint_many(address[8])"(
      gauge_addrs: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    mint_for(
      gauge_addr: string,
      _for: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "mint_for(address,address)"(
      gauge_addr: string,
      _for: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    toggle_approve_mint(
      minting_user: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "toggle_approve_mint(address)"(
      minting_user: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    token(overrides?: CallOverrides): Promise<[string]>;

    "token()"(overrides?: CallOverrides): Promise<[string]>;

    controller(overrides?: CallOverrides): Promise<[string]>;

    "controller()"(overrides?: CallOverrides): Promise<[string]>;

    minted(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "minted(address,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    allowed_to_mint_for(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    "allowed_to_mint_for(address,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  mint(
    gauge_addr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "mint(address)"(
    gauge_addr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  mint_many(
    gauge_addrs: [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string
    ],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "mint_many(address[8])"(
    gauge_addrs: [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string
    ],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  mint_for(
    gauge_addr: string,
    _for: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "mint_for(address,address)"(
    gauge_addr: string,
    _for: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  toggle_approve_mint(
    minting_user: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "toggle_approve_mint(address)"(
    minting_user: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  token(overrides?: CallOverrides): Promise<string>;

  "token()"(overrides?: CallOverrides): Promise<string>;

  controller(overrides?: CallOverrides): Promise<string>;

  "controller()"(overrides?: CallOverrides): Promise<string>;

  minted(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "minted(address,address)"(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  allowed_to_mint_for(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "allowed_to_mint_for(address,address)"(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    mint(gauge_addr: string, overrides?: CallOverrides): Promise<void>;

    "mint(address)"(
      gauge_addr: string,
      overrides?: CallOverrides
    ): Promise<void>;

    mint_many(
      gauge_addrs: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ],
      overrides?: CallOverrides
    ): Promise<void>;

    "mint_many(address[8])"(
      gauge_addrs: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ],
      overrides?: CallOverrides
    ): Promise<void>;

    mint_for(
      gauge_addr: string,
      _for: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "mint_for(address,address)"(
      gauge_addr: string,
      _for: string,
      overrides?: CallOverrides
    ): Promise<void>;

    toggle_approve_mint(
      minting_user: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "toggle_approve_mint(address)"(
      minting_user: string,
      overrides?: CallOverrides
    ): Promise<void>;

    token(overrides?: CallOverrides): Promise<string>;

    "token()"(overrides?: CallOverrides): Promise<string>;

    controller(overrides?: CallOverrides): Promise<string>;

    "controller()"(overrides?: CallOverrides): Promise<string>;

    minted(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "minted(address,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    allowed_to_mint_for(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "allowed_to_mint_for(address,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    Minted(
      recipient: string | null,
      gauge: null,
      minted: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { recipient: string; gauge: string; minted: BigNumber }
    >;
  };

  estimateGas: {
    mint(
      gauge_addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "mint(address)"(
      gauge_addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    mint_many(
      gauge_addrs: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "mint_many(address[8])"(
      gauge_addrs: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    mint_for(
      gauge_addr: string,
      _for: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "mint_for(address,address)"(
      gauge_addr: string,
      _for: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    toggle_approve_mint(
      minting_user: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "toggle_approve_mint(address)"(
      minting_user: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;

    "token()"(overrides?: CallOverrides): Promise<BigNumber>;

    controller(overrides?: CallOverrides): Promise<BigNumber>;

    "controller()"(overrides?: CallOverrides): Promise<BigNumber>;

    minted(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "minted(address,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    allowed_to_mint_for(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "allowed_to_mint_for(address,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    mint(
      gauge_addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "mint(address)"(
      gauge_addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    mint_many(
      gauge_addrs: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "mint_many(address[8])"(
      gauge_addrs: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    mint_for(
      gauge_addr: string,
      _for: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "mint_for(address,address)"(
      gauge_addr: string,
      _for: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    toggle_approve_mint(
      minting_user: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "toggle_approve_mint(address)"(
      minting_user: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "token()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    controller(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "controller()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    minted(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "minted(address,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    allowed_to_mint_for(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "allowed_to_mint_for(address,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
