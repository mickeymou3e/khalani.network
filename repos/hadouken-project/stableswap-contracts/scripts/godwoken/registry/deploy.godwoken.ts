import { constants, Overrides, Signer } from "ethers";

import {
  factoryAddressProvider,
  factoryPoolInfo,
  factoryRegistry,
  factorySwaps,
  factoryMetaPoolFactory,
} from "./factory";

import { connectSwaps } from "./connect";

export async function deployAddressProvider(
  admin: string,
  deployer: Signer,
  transactionOverrides: Overrides
) {
  console.log('[Registry][AddressProvider] Deploy')
  const factory = factoryAddressProvider(deployer)

  const deployTransaction = factory.getDeployTransaction(
    admin,
    transactionOverrides
  )

  const deploymentResult = await deployer.sendTransaction(deployTransaction)
  const deploymentReceipt = await deploymentResult.wait()

  const addressProviderAddress = deploymentReceipt.contractAddress

  console.log('[Registry][AddressProvider] Deployed', addressProviderAddress)

  return addressProviderAddress
}

export async function deployRegistry(
  addressProvider: string,
  deployer: Signer,
  transactionOverrides: Overrides
) {
  console.log('[Registry][Registry] Deploy')
  const factory = factoryRegistry(deployer)

  const deployTransaction = factory.getDeployTransaction(
    addressProvider,
    constants.AddressZero,
    transactionOverrides
  )

  const deploymentResult = await deployer.sendTransaction(deployTransaction)
  const deploymentReceipt = await deploymentResult.wait()

  const registryAddress = deploymentReceipt.contractAddress

  console.log('[Registry][Registry] Deployed', registryAddress)

  return registryAddress
}



export async function deployPoolInfo(
  addressProvider: string,
  deployer: Signer,
  transactionOverrides: Overrides
) {
  console.log('[Registry][PoolInfo] Deploy')
  const factory = factoryPoolInfo(deployer)

  const deployTransaction = factory.getDeployTransaction(
    addressProvider,
    transactionOverrides
  )

  const deploymentResult = await deployer.sendTransaction(deployTransaction)

  const deploymentReceipt = await deploymentResult.wait()

  const poolInfoAddress = deploymentReceipt.contractAddress

  console.log('[Registry][PoolInfo] Deployed', poolInfoAddress)

  return poolInfoAddress
}

export async function deploySwaps(
  addressProvider: string,
  deployer: Signer,
  transactionOverrides: Overrides
) {
  console.log('[Registry][Swaps] Deploy')
  const factory = factorySwaps(deployer)

  const deployTransaction = factory.getDeployTransaction(
    addressProvider,
    constants.AddressZero,
    transactionOverrides
  )

  const deploymentResult = await deployer.sendTransaction(deployTransaction)
  const deploymentReceipt = await deploymentResult.wait()

  const swapsAddress = deploymentReceipt.contractAddress

  console.log('[Registry][Swaps] Deployed', swapsAddress)

  return swapsAddress
}

export async function deployFactory(
  swapsAddress: string,
  deployer: Signer,
  transactionOverrides: Overrides
) {
  console.log('[Registry][Factory] Deploy')
  const factory = factoryMetaPoolFactory(deployer)

  const deployTransaction = factory.getDeployTransaction(transactionOverrides)

  const deploymentResult = await deployer.sendTransaction(deployTransaction)
  const deploymentReceipt = await deploymentResult.wait()

  const factoryAddress = deploymentReceipt.contractAddress

  await postFactoryDeployed(swapsAddress, deployer, transactionOverrides)

  console.log('[Registry][Factory] Deployed', factoryAddress)

  return factoryAddress
}

export async function postFactoryDeployed(
  swapsAddress: string,
  deployer: Signer,
  transactionOverrides: Overrides
) {
  const swaps = connectSwaps(swapsAddress, deployer);

  const updateRegistryCall = await swaps.update_registry_address(
    transactionOverrides
  )

  await updateRegistryCall.wait()
}
