/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IFlashLoanRecipient,
  IFlashLoanRecipientInterface,
} from "../../../contracts/balancer/IFlashLoanRecipient";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20[]",
        name: "tokens",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "feeAmounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "receiveFlashLoan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IFlashLoanRecipient__factory {
  static readonly abi = _abi;
  static createInterface(): IFlashLoanRecipientInterface {
    return new utils.Interface(_abi) as IFlashLoanRecipientInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IFlashLoanRecipient {
    return new Contract(address, _abi, signerOrProvider) as IFlashLoanRecipient;
  }
}
