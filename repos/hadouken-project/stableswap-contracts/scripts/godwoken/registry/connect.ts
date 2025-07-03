import fs from "fs";
import path from "path";
import { constants, ethers, Overrides, Signer } from "ethers";

import AddressProviderJSON from "../../../build/contracts/AddressProvider.json"
import RegistryJSON from "../../../build/contracts/Registry.json"
import PoolInfoJSON from "../../../build/contracts/PoolInfo.json"
import SwapsJSON from "../../../build/contracts/Swaps.json"

import {
  AddressProvider,
  Swaps,
  Registry,
  PoolInfo,
} from "../../../src/contracts";

import { prepare_contract_abi } from "../../../utils/prepare_contracts";

export function connectAddressProvider(address: string, deployer: Signer) {
    const contract = new ethers.Contract(
      address,
      prepare_contract_abi(AddressProviderJSON.abi),
      deployer.provider
    ).connect(deployer) as AddressProvider;
  
    return contract
}

export function connectRegistry(
  address: string,
  deployer: Signer
): Registry {
    const registryContract = new ethers.Contract(
        address,
        prepare_contract_abi(RegistryJSON.abi),
        deployer.provider
    ).connect(deployer) as Registry;

    return registryContract;
}

export function connectPoolInfo(
  address: string,
  deployer: Signer
): PoolInfo {
    const poolInfoContract = new ethers.Contract(
        address,
        JSON.stringify(prepare_contract_abi(PoolInfoJSON.abi)),
        deployer.provider
    ).connect(deployer) as PoolInfo

    return poolInfoContract;
}

export function connectSwaps(address: string, deployer: Signer): Swaps {
    const swapsContract = new ethers.Contract(
        address,
        prepare_contract_abi(SwapsJSON.abi),
        deployer.provider
    ).connect(deployer) as Swaps;

    return swapsContract;
}
