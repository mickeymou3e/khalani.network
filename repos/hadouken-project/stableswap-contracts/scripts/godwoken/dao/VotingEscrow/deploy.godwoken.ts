
import { BigNumber, ContractFactory, ethers, Overrides, Signer } from 'ethers';

import { prepare_contract_abi } from '../../../../utils/prepare_contracts'

import * as VotingEscrowJSON from '../../../../build/contracts/VotingEscrow.json'
import * as VotingEscrowDelegationJSON from '../../../../build/contracts/VotingEscrowDelegation.json'
import * as DelegationProxyJSON from '../../../../build/contracts/DelegationProxy.json'

import {
  VotingEscrow__factory,
  VotingEscrowDelegation__factory,
  DelegationProxy__factory,
} from '../../../../src/contracts';

import { overrideData, getDeploymentDataPath } from '../../utils'

import { VotingEscrowDeploymentData } from './types'

import { VOTING_ESCROW_CONTRACTS_DIR } from './constants'

export async function deployVotingEscrow(
  daoToken: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  console.log('[DAO][VotingEscrow] VotingEscrow deploy')
  const factory = new ContractFactory(
    JSON.stringify(prepare_contract_abi(VotingEscrowJSON.abi)),
    VotingEscrowJSON.bytecode,
    deployer,
  )  as VotingEscrow__factory;

  const deployTransaction = factory.getDeployTransaction(
    daoToken,
    'Vote-escrowed HDK',
    'veHDK',
    'veHDK_1.0.0',
    transactionOverrides,
  );

  const transactionResult = await deployer.sendTransaction(deployTransaction);
  const receipt = await transactionResult.wait();

  const votingEscrowAddress = receipt.contractAddress
  console.log('[DAO][VotingEscrow] VotingEscrow deployed', votingEscrowAddress)

  return votingEscrowAddress
}

/**
 * 
 * @param deployer 
 * @param transactionOverrides 
 * @returns VotingEscrowDelegation address
 * 
 * Be Careful implicit parameter VOTING_ESCROW address is hard-coded in contract code.
 * Make sure that in-contract address of VotingEscrow is appropriate
 */
export async function deployVotingEscrowDelegation(
  deployer: Signer,
  transactionOverrides: Overrides
) {
  console.log('[DAO][VotingEscrow] VotingEscrowDelegation deploy')
  const factory = new ContractFactory(
    JSON.stringify(prepare_contract_abi(VotingEscrowDelegationJSON.abi)),
    VotingEscrowDelegationJSON.bytecode,
    deployer,
  )  as VotingEscrowDelegation__factory;

  const deployTransaction = factory.getDeployTransaction(
    "Voting Escrow Boost Delegation",
    "veBoost",
    "",
    transactionOverrides,
  );

  const transactionResult = await deployer.sendTransaction(deployTransaction);
  const receipt = await transactionResult.wait();

  const votingEscrowDelegationAddress = receipt.contractAddress
  console.log('[DAO][VotingEscrow] VotingEscrowDelegation deployed', votingEscrowDelegationAddress)

  return votingEscrowDelegationAddress
}
export async function deployVotingEscrowDelegationProxy(
  veDelegation: string,
  ownershipAdmin: string,
  emergencyAdmin: string,
  deployer: Signer,
  transactionOverrides: Overrides
) {
  console.log('[DAO][VotingEscrow] DelegationProxy deploy')
  const factory = new ContractFactory(
    JSON.stringify(prepare_contract_abi(DelegationProxyJSON.abi)),
    DelegationProxyJSON.bytecode,
    deployer,
  )  as DelegationProxy__factory;

  const deployTransaction = factory.getDeployTransaction(
    veDelegation,
    ownershipAdmin,
    emergencyAdmin,
    transactionOverrides,
  );

  const transactionResult = await deployer.sendTransaction(deployTransaction);
  const receipt = await transactionResult.wait();

  const delegationProxyAddress = receipt.contractAddress
  console.log('[DAO][VotingEscrow] DelegationProxy deployed', delegationProxyAddress)
  
  return delegationProxyAddress
}
