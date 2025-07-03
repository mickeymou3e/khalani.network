import { BigNumber, constants, Overrides, providers, Signer } from "ethers";

import Config from '../../../../../config.json'

import { transactionOverrides } from "../../../deployment.godwoken";
import connectERC20 from "../../../tokens/ERC20/connect";
import { getData, getDeploymentDataPath, packNumbers, wait } from "../../../utils";

import { connectRegistry, connectSwaps } from '../../connect'
import { REGISTRY_CONTRACTS_DIR } from "../../constants";
import { RegistryDeploymentData } from "../../types";

export async function updateRegistryAddress(
    swapsAddress: string,
    deployer: Signer,
    transactionOverrides: Overrides,
) {
    console.log(`[Registry][Swap] Swap ${swapsAddress}`)
    const swaps = connectSwaps(swapsAddress, deployer)

    let registry = await swaps.registry(transactionOverrides)
    let factory = await swaps.factory_registry(transactionOverrides)

    console.log(`[Registry][Swap] get Restistry from Swap ${registry}`)
    console.log(`[Registry][Swap] get Factory from Swap ${factory}`)

    const updateRegistryAddress = await swaps.update_registry_address(transactionOverrides)
    await updateRegistryAddress.wait()
    await wait(Config.timeout)

    registry = await swaps.registry(transactionOverrides)
    factory = await swaps.factory_registry(transactionOverrides)

    console.log(`[Registry][Swap] End Swaps`)
}

export async function runUpdateRegistryAddress({
    network,
    admin,
    deployer,
    provider,
  }: {
    network: string,
    admin: string,
    deployer: Signer,
    provider: providers.JsonRpcProvider,
  }) {
    const deploymentData = getDeploymentDataPath(REGISTRY_CONTRACTS_DIR, network)
    const registryData = getData<RegistryDeploymentData>(deploymentData)
  
    const swapAddress = registryData?.Swaps
  
    if (swapAddress) {
      await updateRegistryAddress(swapAddress, deployer, transactionOverrides)
    }
  }

export async function getFactory({
  network,
  admin,
  deployer,
  provider,
}: {
  network: string,
  admin: string,
  deployer: Signer,
  provider: providers.JsonRpcProvider,
}) {
  const deploymentData = getDeploymentDataPath(REGISTRY_CONTRACTS_DIR, network)
  const registryData = getData<RegistryDeploymentData>(deploymentData)

  const swapsAddress = registryData?.Swaps
  if (swapsAddress) {
    const swaps = connectSwaps(swapsAddress, deployer)
    const factoryAddress = await swaps.factory_registry(transactionOverrides)

    console.log('[Swaps] factory registry address', factoryAddress)
  }
}

export async function getRegistry({
  network,
  admin,
  deployer,
  provider,
}: {
  network: string,
  admin: string,
  deployer: Signer,
  provider: providers.JsonRpcProvider,
}) {
  const deploymentData = getDeploymentDataPath(REGISTRY_CONTRACTS_DIR, network)
  const registryData = getData<RegistryDeploymentData>(deploymentData)

  const swapsAddress = registryData?.Swaps
  if (swapsAddress) {
    const swaps = connectSwaps(swapsAddress, deployer)
    const registryAddress = await swaps.registry(transactionOverrides)

    console.log('[Swaps] registry address', registryAddress)
  }
}

export async function getBestRate(
  fromAddress: string,
  toAddress: string,
  amount: BigNumber,
  {
    network,
    admin,
    deployer,
    provider,
  }: {
  network: string,
  admin: string,
  deployer: Signer,
  provider: providers.JsonRpcProvider,
}): Promise<[string, BigNumber] | null> {
  const deploymentData = getDeploymentDataPath(REGISTRY_CONTRACTS_DIR, network)
  const registryData = getData<RegistryDeploymentData>(deploymentData)

  const swapsAddress = registryData?.Swaps
  if (swapsAddress) {
    const swaps = connectSwaps(swapsAddress, deployer)
    try {
      const [poolName, exchangeAmount] = await swaps["get_best_rate(address,address,uint256)"](
        fromAddress, toAddress, amount, transactionOverrides
      )
      
      return [poolName, exchangeAmount]
    } catch(err) {
      console.error(err)
    }
  }

  return null
}

export async function swap(
  poolAddress: string,
  fromAddress: string,
  toAddress: string,
  amount: BigNumber,
  expectedAmount: BigNumber,
  {
    network,
    admin,
    deployer,
    provider,
  }: {
  network: string,
  admin: string,
  deployer: Signer,
  provider: providers.JsonRpcProvider,
}) {
  const deploymentData = getDeploymentDataPath(REGISTRY_CONTRACTS_DIR, network)
  const registryData = getData<RegistryDeploymentData>(deploymentData)

  const swapsAddress = registryData?.Swaps
  if (swapsAddress) {
    const swaps = connectSwaps(swapsAddress, deployer)
    try {
      const swapTransaction = await swaps["exchange(address,address,address,uint256,uint256)"](
        poolAddress, fromAddress, toAddress, amount, expectedAmount, transactionOverrides
      )
      await swapTransaction.wait()
      

    } catch(err) {
      console.error(err)
    }
  }
}