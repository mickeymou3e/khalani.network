import { Overrides, Signer } from "ethers";

import Config from '../../../config.json'

import { getDeploymentDataPath, overrideData, wait } from "../utils";

import { REGISTRY_CONTRACTS_DIR } from './constants'
import { RegistryDeploymentData } from './types'
import { updateRegistries } from "./methods/addressProvider/updateRegistry";
import { deployAddressProvider, deployFactory, deployPoolInfo, deployRegistry, deploySwaps } from "./deploy.godwoken";
import { updateRegistryAddress } from "./methods/swaps/updateRegistryAddress";

export async function deployAll(
  network: string,
  admin: string,
  deployer: Signer,
  transactionOverrides: Overrides
) {
  const addressProvider = await deployAddressProvider(
    admin,
    deployer,
    transactionOverrides
  )
  await wait(Config.timeout)
  
  const registry = await deployRegistry(
    addressProvider,
    deployer,
    transactionOverrides
  )
  await wait(Config.timeout)

  const poolInfo = await deployPoolInfo(
    addressProvider,
    deployer,
    transactionOverrides
  )
  await wait(Config.timeout)

  const swaps = await deploySwaps(
    addressProvider,
    deployer,
    transactionOverrides
  )
  await wait(Config.timeout)

  const factory = await deployFactory(
    swaps,
    deployer,
    transactionOverrides
  )
  await wait(Config.timeout)


  await updateRegistries(
    addressProvider,
    {
      registry,
      poolInfo,
      swaps,
      factory,
    },
    deployer,
    transactionOverrides,
  )
  await wait(Config.timeout)

  await updateRegistryAddress(swaps, deployer, transactionOverrides)
  await wait(Config.timeout)

  const deploymentDataPath = getDeploymentDataPath(REGISTRY_CONTRACTS_DIR, network)
  overrideData<RegistryDeploymentData>(deploymentDataPath, {
    AddressProvider: addressProvider,
    Registry: registry,
    PoolInfo: poolInfo,
    Swaps: swaps,
    Factory: factory,
  })

  return {
    addressProvider,
    registry,
    poolInfo,
    swaps,
    factory,
  }
}
