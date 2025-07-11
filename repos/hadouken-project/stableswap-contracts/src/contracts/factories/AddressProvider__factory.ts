/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { AddressProvider } from "../AddressProvider";

export class AddressProvider__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _admin: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<AddressProvider> {
    return super.deploy(_admin, overrides || {}) as Promise<AddressProvider>;
  }
  getDeployTransaction(
    _admin: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_admin, overrides || {});
  }
  attach(address: string): AddressProvider {
    return super.attach(address) as AddressProvider;
  }
  connect(signer: Signer): AddressProvider__factory {
    return super.connect(signer) as AddressProvider__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AddressProvider {
    return new Contract(address, _abi, signerOrProvider) as AddressProvider;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        name: "addr",
        type: "address",
      },
      {
        indexed: false,
        name: "description",
        type: "string",
      },
    ],
    name: "NewAddressIdentifier",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        name: "new_address",
        type: "address",
      },
      {
        indexed: false,
        name: "version",
        type: "uint256",
      },
    ],
    name: "AddressModified",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "deadline",
        type: "uint256",
      },
      {
        indexed: true,
        name: "admin",
        type: "address",
      },
    ],
    name: "CommitNewAdmin",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "admin",
        type: "address",
      },
    ],
    name: "NewAdmin",
    type: "event",
  },
  {
    inputs: [
      {
        name: "_admin",
        type: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "get_registry",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "max_id",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_id",
        type: "uint256",
      },
    ],
    name: "get_address",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_address",
        type: "address",
      },
      {
        name: "_description",
        type: "string",
      },
    ],
    name: "add_new_id",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_id",
        type: "uint256",
      },
      {
        name: "_address",
        type: "address",
      },
    ],
    name: "set_address",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_id",
        type: "uint256",
      },
    ],
    name: "unset_address",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_new_admin",
        type: "address",
      },
    ],
    name: "commit_transfer_ownership",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "apply_transfer_ownership",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "revert_transfer_ownership",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "transfer_ownership_deadline",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "future_admin",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "arg0",
        type: "uint256",
      },
    ],
    name: "get_id_info",
    outputs: [
      {
        name: "addr",
        type: "address",
      },
      {
        name: "is_active",
        type: "bool",
      },
      {
        name: "version",
        type: "uint256",
      },
      {
        name: "last_modified",
        type: "uint256",
      },
      {
        name: "description",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x602061089561014039602061089560c03960c05160a01c1561002057600080fd5b610140516001556001600455600d610160527f4d61696e20526567697374727900000000000000000000000000000000000000610180526101608060046005600060e05260c052604060c02060c052602060c0200160c052602060c020602082510161012060006002818352015b826101205160200211156100a1576100c3565b61012051602002850151610120518501555b815160010180835281141561008e575b50505050505061087d56341561000a57600080fd5b6004361015610018576107a9565b600035601c5263a262904b600051141561003a5760005460005260206000f350005b630c6d784f600051141561006c5760045460018082101561005a57600080fd5b8082039050905060005260206000f350005b63493f4f74600051141561009e57600560043560e05260c052604060c02060c052602060c0205460005260206000f350005b63168f957960005114156102735760043560a01c156100bc57600080fd5b60606024356004016101403760406024356004013511156100dc57600080fd5b60015433146100ea57600080fd5b60006004353b116100fa57600080fd5b6004546101c05260056101c05160e05260c052604060c02060c052602060c02060043581556001600182015560016002820155426003820155610140806004830160c052602060c020602082510161012060006003818352015b8261012051602002111561016757610189565b61012051602002850151610120518501555b8151600101808352811415610154575b505050505050506101c05160018181830110156101a557600080fd5b808201905090506004556004356102205260406101e0526101e051610240526101408051602001806101e051610220018284600060045af16101e657600080fd5b50506101e05161022001518060206101e051610220010101818260206001820306601f820103905003368237505060206101e051610220015160206001820306601f82010390506101e05101016101e0526101c0517f5b0f9b31dc08c19adcc0181c1b97ad54a84487faf0a4fdcb88c8681724298af96101e051610220a26101c05160005260206000f350005b636a84cad060005114156103c45760243560a01c1561029157600080fd5b600154331461029f57600080fd5b60006024353b116102af57600080fd5b600435600454116102bf57600080fd5b6002600560043560e05260c052604060c02060c052602060c020015460018181830110156102ec57600080fd5b8082019050905061014052602435600560043560e05260c052604060c02060c052602060c0205560016001600560043560e05260c052604060c02060c052602060c0200155610140516002600560043560e05260c052604060c02060c052602060c0200155426003600560043560e05260c052604060c02060c052602060c0200155600435151561037e576024356000555b6024356101605261014051610180526004357fe7a6334c4f573efdf292d404d59adacec345f4f7c76495a034008edda0acef476040610160a2600160005260206000f350005b635eec0daa60005114156104c75760015433146103e057600080fd5b6001600560043560e05260c052604060c02060c052602060c020015461040557600080fd5b60006001600560043560e05260c052604060c02060c052602060c02001556000600560043560e05260c052604060c02060c052602060c02055426003600560043560e05260c052604060c02060c052602060c0200155600435151561046a5760006000555b6000610140526002600560043560e05260c052604060c02060c052602060c0200154610160526004357fe7a6334c4f573efdf292d404d59adacec345f4f7c76495a034008edda0acef476040610140a2600160005260206000f350005b636b441a4060005114156105665760043560a01c156104e557600080fd5b60015433146104f357600080fd5b6002541561050057600080fd5b426203f48081818301101561051457600080fd5b808201905090506101405261014051600255600435600355600435610140517f181aa3aa17d4cbf99265dd4443eba009433d3cde79d60164fde1d1a192beb93560006000a3600160005260206000f350005b636a1c05ae60005114156105ea57600154331461058257600080fd5b60006002541861059157600080fd5b6002544210156105a057600080fd5b60035461014052610140516001556000600255610140517f71614071b88dee5e0b2ae578a9dd7b2ebbe9ae832ba419dc0242cd065a290b6c60006000a2600160005260206000f350005b6386fbf193600051141561061857600154331461060657600080fd5b6000600255600160005260206000f350005b63f851a44060005114156106345760015460005260206000f350005b63e0a0b58660005114156106505760025460005260206000f350005b6317f7182a600051141561066c5760035460005260206000f350005b6392668ecb60005114156107a857600560043560e05260c052604060c0206101408060a081808560c052602060c0205481525050602082019150818060018660c052602060c020015481525050602082019150818060028660c052602060c020015481525050602082019150818060038660c052602060c0200154815250506020820191508082528083018060048660c052602060c020018060c052602060c02082602082540161012060006003818352015b8261012051602002111561073257610754565b61012051850154610120516020028501525b815160010180835281141561071f575b5050505050508051806020830101818260206001820306601f8201039050033682375050805160200160206001820306601f820103905090509050810190508090509050905060c05260c051610140f39050005b5b60006000fd5b6100ce61087d036100ce6000396100ce61087d036000f3";
