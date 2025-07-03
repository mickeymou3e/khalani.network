import fs from 'fs'
import { Signer, Overrides } from 'ethers';

import Config from '../../../config.json'

import { POOLS_CONTRACTS_DIR } from './constants'
import { addPool } from '../registry/methods/registry/addPool';
import { deploy } from './deploy.godwoken';
import { transferOwnership } from './methods/transferOwnership';
import { getData, getDeploymentDataPath, wait } from '../utils';
import { REGISTRY_CONTRACTS_DIR } from '../registry/constants';
import { RegistryDeploymentData } from '../registry/types';
import { ScriptRunParameters } from '../types';
import { addLiquidity } from './methods/addLiquidity';

export async function deployAll(
  admin: string,
  network: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  const poolsNames = fs.readdirSync(POOLS_CONTRACTS_DIR);

  const deploymentData = getDeploymentDataPath(REGISTRY_CONTRACTS_DIR, network)
  const registyData = getData<RegistryDeploymentData>(deploymentData)
  const registry = registyData?.Registry

  const pools: { pool: string, lpToken: string, tokens: string[] }[] = []
  for(const poolName of poolsNames) {
    // if (poolName === 'ckb_dckb') {
      const { pool, lpToken, tokens } = await deploy(poolName, admin, network, deployer, transactionOverrides) ?? {}
      await wait(Config.timeout)
  
      if (registry && pool && lpToken && tokens) {
        await addPool(poolName, pool, tokens, lpToken, registry, deployer, transactionOverrides)
        await wait(Config.timeout)
  
        pools.push({ pool, lpToken, tokens })
      }
    // }
  }

  return pools
}

export async function transferOwnershipAll(
  newAdmin: string,
  network: string,
  deployer: Signer,
  transactionOverrides: Overrides,
) {
  const poolsNames = fs.readdirSync(POOLS_CONTRACTS_DIR)

  for(const poolName of poolsNames) {
    await transferOwnership(poolName, newAdmin, network, deployer, transactionOverrides)
    await wait(Config.timeout)
  }
}

export async function addLiquidityAll({
  network,
  admin,
  deployer,
  provider,
  transactionOverrides,
}: ScriptRunParameters) {
  const poolsNames = fs.readdirSync(POOLS_CONTRACTS_DIR)

  for(const poolName of poolsNames) {
    await addLiquidity(poolName, network, deployer, transactionOverrides)
  }
}