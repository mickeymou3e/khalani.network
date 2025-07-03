import path from 'path'

import { Signer, Overrides } from 'ethers';

import { getData, getDeploymentDataPath } from '../../utils';
import { getPoolContractCompiled, getPoolContractName } from '../utils';

import connect from '../connect'

import { PoolDeploymentData } from '../types'
import { POOLS_CONTRACTS_DIR } from '../constants'

export async function getVirtualPrice(
  poolName: string,
  network: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  const poolContractDir = path.join(POOLS_CONTRACTS_DIR, poolName)
  const poolDeploymentDataPath = getDeploymentDataPath(poolContractDir, network)
  const deploymentData = getData<PoolDeploymentData>(poolDeploymentDataPath)


  const poolContractName = getPoolContractName(poolName)
  const poolContractCompiled = getPoolContractCompiled(poolContractName)

  const poolAddress = deploymentData && deploymentData[poolContractName]

  if (poolAddress) {
    const pool = connect(poolAddress, poolContractCompiled.abi, deployer)
  
    const get_virtual_price = await pool.get_virtual_price(transactionOverrides)
    return get_virtual_price
  }

  return null
}