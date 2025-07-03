require("dotenv").config();

import ConfigJSON from "../../../../config.json";

import {
  connectRPC,
  transactionOverrides,
} from "../../deployment.godwoken"

import { providers, Signer } from "ethers"

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

if (!DEPLOYER_PRIVATE_KEY) {
  throw new Error(
    'Set env variable DEPLOYER_PRIVATE_KEY or add to .env config file'
  )
}

export interface Config {
    network: string
    admin: string
    deployer: Signer
    provider: providers.JsonRpcProvider
}

async function getConfig(): Promise<Config> {
  const network = ['godwoken', ConfigJSON.env].filter(arg => arg).join('.')
  const { deployer, provider, translateAddress } = await connectRPC(DEPLOYER_PRIVATE_KEY as string, ConfigJSON)
  const admin = translateAddress(deployer.address)

  return {
    network,
    admin,
    deployer,
    provider,
  }
}

export type HealthCheckFn = (config: Config) => Promise<void>

export async function runHealthCheck(healthCheckFn: HealthCheckFn) {
    const config = await getConfig()

    try {
        await healthCheckFn(config)
    } catch(error) {
        console.error(error)
    }
}