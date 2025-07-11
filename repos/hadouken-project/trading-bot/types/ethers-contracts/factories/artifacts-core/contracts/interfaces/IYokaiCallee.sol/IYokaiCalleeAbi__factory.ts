/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IYokaiCalleeAbi,
  IYokaiCalleeAbiInterface,
} from "../../../../../artifacts-core/contracts/interfaces/IYokaiCallee.sol/IYokaiCalleeAbi";

const _abi = [
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "yokaiCall",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IYokaiCalleeAbi__factory {
  static readonly abi = _abi;
  static createInterface(): IYokaiCalleeAbiInterface {
    return new utils.Interface(_abi) as IYokaiCalleeAbiInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IYokaiCalleeAbi {
    return new Contract(address, _abi, signerOrProvider) as IYokaiCalleeAbi;
  }
}
