import { ContractFactory, ethers, Signer } from 'ethers';

import { prepare_contract_abi } from '../../../utils/prepare_contracts'

import * as RegistryJSON from '../../../build/contracts/Registry.json'
import * as SwapsJSON from '../../../build/contracts/Swaps.json'
import * as AddressProviderJSON from '../../../build/contracts/AddressProvider.json'
import * as PoolInfoJSON from '../../../build/contracts/PoolInfo.json'
import * as MetaPoolFactoryJSON from '../../../build/contracts/Factory.json'

import {
  AddressProvider__factory,
  Registry__factory,
  PoolInfo__factory,
  Swaps__factory,
  Factory__factory,
} from '../../../src/contracts';

export function factoryAddressProvider(deployer: Signer) {
  const factory = new ContractFactory(
    prepare_contract_abi(AddressProviderJSON.abi),
    AddressProviderJSON.bytecode,
    deployer
  )  as AddressProvider__factory;

  return factory
}

export function factoryRegistry(deployer: Signer) {
  const factory = new ContractFactory(
    prepare_contract_abi(RegistryJSON.abi),
    RegistryJSON.bytecode,
    deployer
  )  as Registry__factory;

  return factory
}

export function factoryPoolInfo(deployer: Signer) {
  const factory = new ContractFactory(
    prepare_contract_abi(PoolInfoJSON.abi),
    PoolInfoJSON.bytecode,
    deployer
  )  as PoolInfo__factory;

  return factory
}

export function factorySwaps(deployer: Signer) {
  const factory = new ContractFactory(
    JSON.stringify(prepare_contract_abi(SwapsJSON.abi)),
    SwapsJSON.bytecode,
    deployer
  )  as Swaps__factory;

  return factory
}

export function factoryMetaPoolFactory(deployer: Signer) {
  const factory = new ContractFactory(
    JSON.stringify(prepare_contract_abi(MetaPoolFactoryJSON.abi)),
    MetaPoolFactoryJSON.bytecode,
    deployer
  )  as Factory__factory;

  return factory
}