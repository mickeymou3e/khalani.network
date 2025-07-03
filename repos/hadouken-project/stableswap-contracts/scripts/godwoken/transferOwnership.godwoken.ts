require("dotenv").config();

import Config from "../../config.json";

import {
  connectRPC,
  transactionOverrides,
} from "./deployment.godwoken"

import { transferOwnership as transferOwnershipAddressProvider } from "./registry/methods/addressProvider/transferOwnership";
import { transferOwnershipAll as transferOwnershipAllPools } from "./pools/batch.godwoken";

import { getData, getDeploymentDataPath, wait } from './utils'
import { providers, Signer } from "ethers"
import { REGISTRY_CONTRACTS_DIR } from "./registry/constants";
import { RegistryDeploymentData } from "./registry/types";

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

if (!DEPLOYER_PRIVATE_KEY) {
  throw new Error(
    'Set env variable DEPLOYER_PRIVATE_KEY or add to .env config file'
  )
}

async function getConfig(): Promise<{
  network: string
  admin: string
  deployer: Signer
  provider: providers.JsonRpcProvider
}> {
  const network = ['godwoken', Config.env].filter(arg => arg).join('.')
  const { deployer, provider, translateAddress } = await connectRPC(DEPLOYER_PRIVATE_KEY as string, Config)
  const admin = translateAddress(deployer.address)

  return {
    network,
    admin,
    deployer,
    provider,
  }
}

async function transferOwnershipAll({
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
  const newAdmin = '0x49c11CB0cDDEf9c3751a2681dBF4c8974aC35D0D'

  console.log('[TransferOwnership][Address] Old admin', admin);
  console.log('[TransferOwnership][Address] New admin', newAdmin);


  const deploymentDataPath = getDeploymentDataPath(REGISTRY_CONTRACTS_DIR, network)
  const registryDeploymentData = getData<RegistryDeploymentData>(deploymentDataPath)

  if (registryDeploymentData) {
    const addressProviderAddress = registryDeploymentData.AddressProvider
  
    await transferOwnershipAddressProvider(
      addressProviderAddress,
      newAdmin,
      deployer,
      transactionOverrides,
    )
    await wait(Config.timeout)
  
    await transferOwnershipAllPools(
      newAdmin,
      network,
      deployer,
      transactionOverrides
    )
    await wait(Config.timeout)
  
    console.log('[TransferOwnership][Address] Confirm new owner', newAdmin);
  }
}



async function run() {
  const config = await getConfig()
  transferOwnershipAll(config)
}

run()
