
import { BigNumber, ContractFactory, ethers, Overrides, Signer } from 'ethers';

import { prepare_contract_abi } from '../../../../utils/prepare_contracts'

import * as UserBalancesJSON from '../../../../build/contracts/UserBalances.json'

import {
  UserBalances__factory
} from '../../../../src/contracts';

import { overrideData, getDeploymentDataPath } from '../../utils'
import { REGISTRY_CONTRACTS_DIR } from '../constants';
import { ScriptRunParameters } from '../../types';
import { RegistryDeploymentData } from '../types';

export async function deploy({
  network,
  deployer,
  transactionOverrides
}: ScriptRunParameters) {
  console.log('[UserBalance] UserBalance deploy')
  const factory = new ContractFactory(
    JSON.stringify(prepare_contract_abi(UserBalancesJSON.abi)),
    UserBalancesJSON.bytecode,
    deployer,
  )  as UserBalances__factory;

  const deployTransaction = factory.getDeployTransaction(
    transactionOverrides,
  );

  const transactionResult = await deployer.sendTransaction(deployTransaction);
  const receipt = await transactionResult.wait();

  const userBalanceAddress = receipt.contractAddress
  console.log('[UserBalance] UserBalance deployed', userBalanceAddress)
  
  const deploymentDataPath = getDeploymentDataPath(REGISTRY_CONTRACTS_DIR, network)
  overrideData<RegistryDeploymentData>(deploymentDataPath, {
    UserBalances: userBalanceAddress,
  })
  
  return userBalanceAddress
}
