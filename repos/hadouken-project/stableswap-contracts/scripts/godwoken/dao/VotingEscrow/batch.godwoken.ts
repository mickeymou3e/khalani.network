
import { Overrides, Signer } from 'ethers';

import Config from '../../../../config.json'

import { overrideData, getDeploymentDataPath, wait } from '../../utils'

import { VotingEscrowDeploymentData } from './types'

import { VOTING_ESCROW_CONTRACTS_DIR } from './constants'
import { deployVotingEscrow, deployVotingEscrowDelegation, deployVotingEscrowDelegationProxy } from './deploy.godwoken';

export async function deployAll(
  network: string,
  daoToken: string,
  admin: string,
  deployer: Signer,
  transactionOverrides: Overrides
) {
  console.log('[DAO][VotingEscrow]')
  const votingEscrow = await deployVotingEscrow(daoToken, deployer, transactionOverrides)
  await wait(Config.timeout)
  
  const votingEscrowDelegatoin = await deployVotingEscrowDelegation(deployer, transactionOverrides)
  await wait(Config.timeout)

  const votingEscrowDelegationProxy = await deployVotingEscrowDelegationProxy(
    votingEscrowDelegatoin,
    admin,
    admin,
    deployer,
    transactionOverrides,
  )
  await wait(Config.timeout)

  const path = getDeploymentDataPath(VOTING_ESCROW_CONTRACTS_DIR, network)
  overrideData<VotingEscrowDeploymentData>(path, {
    VotingEscrow: votingEscrow,
    VotingEscrowDelegation: votingEscrowDelegatoin,
    DelegationProxy: votingEscrowDelegationProxy,
  })
  console.log('[DAO][VotingEscrow]')

  return votingEscrow
}
