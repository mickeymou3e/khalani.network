require("dotenv").config();

import Config from "../../config.json";

import {
  connectRPC,
  transactionOverrides,
} from "./deployment.godwoken"

import { deployAll as deployAllRegistries } from "./registry/batch.godwoken";
import { deployAll as deployAllPools, addLiquidityAll } from "./pools/batch.godwoken";
import { deployAll as deployDaoAll } from './dao/batch.godwoken'

import { deploy as deployUserBalances } from './registry/userBalances/deploy.godwoken'

import { deployAll as deployTokensAll} from './tokens/batch.godwoken'

import { wait } from './utils'
import { providers, Signer } from "ethers"
import { ScriptRunParameters } from "./types";

import { mintAll } from "./tokens/ERC20/batch.godwoken";


const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

if (!DEPLOYER_PRIVATE_KEY) {
  throw new Error(
    'Set env variable DEPLOYER_PRIVATE_KEY or add to .env config file'
  )
}

async function getScriptRunParameters(): Promise<ScriptRunParameters> {
  const network = ['godwoken', Config.env].filter(arg => arg).join('.')
  const { deployer, provider, translateAddress } = await connectRPC(DEPLOYER_PRIVATE_KEY as string, Config)
  const admin = translateAddress(deployer.address)

  return {
    network,
    admin,
    deployer,
    provider,
    transactionOverrides,
  }
}

async function deployAll({
  network,
  admin,
  deployer,
  provider,
}: ScriptRunParameters) {
  const deployerAddress = await deployer.getAddress()
  
  console.log('[Deployer][Address] Ethereum address', deployerAddress)
  console.log('[Deployer][Address] Godwoken address', admin)

  const blockNumber = await provider.getBlockNumber()
  console.log('[Deployment] Block number', blockNumber)

  await deployTokensAll(network, deployer, transactionOverrides)
  await wait(Config.timeout)

  await deployAllRegistries(network, admin, deployer, transactionOverrides)
  await wait(Config.timeout)

  // await deployDaoAll(network, admin, deployer, transactionOverrides)
  // await wait(Config.timeout)

  await deployAllPools(
    admin,
    network,
    deployer,
    transactionOverrides
  )
  await wait(Config.timeout)
}



async function run() {
  const scriptRunParameters = await getScriptRunParameters()
  
  await deployAll(scriptRunParameters)

  await mintAll(scriptRunParameters)
  await addLiquidityAll(scriptRunParameters)
}

async function runDeployBalances() {
  const scriptRunParameters = await getScriptRunParameters()

  await deployUserBalances(scriptRunParameters)
}

runDeployBalances()
