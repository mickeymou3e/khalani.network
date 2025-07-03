import path from 'path'

import { Signer, Overrides } from 'ethers';

import { getData, getDeploymentDataPath } from '../../utils';
import { getPoolContractCompiled, getPoolContractName } from '../utils';

import connect from '../connect'

import { PoolDeploymentData } from '../types'
import { POOLS_CONTRACTS_DIR } from '../constants'

export async function transferOwnership(
  poolName: string,
  newAdmin: string,
  network: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  console.log(`[Pool][${poolName}] Transfer Ownership. New Admin`, newAdmin)

  const poolContractDir = path.join(POOLS_CONTRACTS_DIR, poolName)
  const poolDeploymentDataPath = getDeploymentDataPath(poolContractDir, network)
  const deploymentData = getData<PoolDeploymentData>(poolDeploymentDataPath)


  const poolContractName = getPoolContractName(poolName)
  const poolContractCompiled = getPoolContractCompiled(poolContractName)

  const poolAddress = deploymentData && deploymentData[poolContractName]

  if (poolAddress) {
    const pool = connect(poolAddress, poolContractCompiled.abi, deployer)
  
    const commitTransferOwnership = await pool.commit_transfer_ownership(newAdmin, transactionOverrides)
    const receipt = await commitTransferOwnership.wait()
  
    console.log(`[Pool][${poolName}] Ownership Transfered`)
    return receipt.transactionHash
  }

  return null
}