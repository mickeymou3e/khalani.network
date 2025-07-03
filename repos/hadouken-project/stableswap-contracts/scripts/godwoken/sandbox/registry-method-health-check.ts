require('dotenv').config()

import { BigNumber } from "@ethersproject/bignumber";
import { connectRegistry, connectSwaps, connectPool } from '../connect'

import { transactionOverrides, connectRPC } from '../deployment.godwoken'
import { Registry, Swaps } from '../../../src/contracts'

import { getRegistryData } from '../registry';
import StableSwap2dCKBwCKBPool_JSON from '../../../build/contracts/StableSwap2dCKBwCKBPool.json'

require('dotenv').config()

const DEPLOYMENT_NETWORK = process.env.DEPLOYMENT_NETWORK;
const DEPLOYMENT_ENV = process.env.DEPLOYMENT_ENV;

console.log('.env')
console.log('DEPLOYMENT_NETWORK', DEPLOYMENT_NETWORK)
console.log('DEPLOYMENT_ENV', DEPLOYMENT_ENV)
console.log('')

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
if (!DEPLOYER_PRIVATE_KEY) {
  throw new Error('Set env variable DEPLOYER_PRIVATE_KEY or add to .env config file')
}

if (!DEPLOYMENT_NETWORK) {
  throw new Error('Deployment network not provided . Set viw "export DEPLOYMENT_NETWORK" or .env config file')
}
import config from '../../../config.json'
import { prepare_contract_abi } from "../../../utils/prepare_contracts";

async function healthCheck() {
  const network = ['godwoken', config.env].filter(arg => arg).join('.')
  console.log('deploy network', network)
  console.log('network', network)

  const registryData = getRegistryData(network)
  console.log('registry data', registryData)
  const { deployer, translateAddress } = await connectRPC(DEPLOYER_PRIVATE_KEY as string, config)

  let registry: Registry | null = null
  let swaps: Swaps | null = null

  if (registryData) {
    registry = await connectRegistry(registryData.registry_address, deployer)
    swaps = await connectSwaps(registryData.swaps_address, deployer)

    console.log('registry', registryData.registry_address)
    console.log('swaps', registryData.swaps_address)
  }

  if (registry && swaps) {
    console.log('registry address', registry.address)

    const pool_count = await registry.pool_count()
    console.log('pool count', pool_count.toString())

    const pools = []
    const poolsToRemove = []
    const poolsWhitelist = [
      '0XEC6E339081624404BF5228B73DB040253064D8A9',
      '0x116fA05a8FBD198d95Ca489eCEc85a40678A234A',
    ].map(address => address.toUpperCase())

    for (let i = 0; i < pool_count.toNumber(); i++) {
      try {
        const pool = await registry.pool_list(i)
        console.log('pool', pool)

        const poolName = await registry.get_pool_name(pool)
        console.log('pool name', poolName)

        console.log('pool whitelist', poolsWhitelist)
        console.log('pool', pool.toUpperCase())
        console.log('remove?', poolsWhitelist.includes(pool.toUpperCase()))

        if (!poolsWhitelist.includes(pool.toUpperCase())) {
          poolsToRemove.push(pool)
          console.log('add pool to remove', pool)
        } else {
          pools.push(pool)
        }
      } catch(error) {
        console.log(error)
      }
    }

    // for (let i = 0; i < poolsToRemove.length; i++) {
    //   const removePoolTx = await registry.remove_pool(poolsToRemove[i], transactionOverrides)
    //   await removePoolTx.wait()
    //   console.log('pool removed', poolsToRemove[i])
    // }

    for (let i = 0; i < pools.length; i++) {
      try {
        const tokens = await registry.get_coins(pools[i])
        
        const amount = BigNumber.from(100).mul(BigNumber.from(10).pow(BigNumber.from(8)))
        console.log('tokens', tokens[0], tokens[1])
        
        const poolForSwap = await registry["find_pool_for_coins(address,address)"](tokens[0], tokens[1])
        console.log('pool for swap', poolForSwap)

        const pool = connectPool(
          poolForSwap,
          prepare_contract_abi(StableSwap2dCKBwCKBPool_JSON.abi),
          deployer
        )

        const uToken0 = await pool.coins(0)
        console.log('underlying token 0', uToken0)

        const uToken1 = await pool.coins(1)
        console.log('underlying token 1', uToken1)

        const nCoins = await registry.get_n_coins(poolForSwap)
        console.log('n tokens', nCoins.map(nCoin => nCoin.toString()))

        const coins = await registry.get_coins(poolForSwap)
        console.log('tokens', coins)

        const indices = await registry["get_coin_indices(address,address,address)"](poolForSwap, tokens[0], tokens[1])
        console.log('tokens indices', indices)

        const exchangeAmout = await swaps.get_exchange_amount(poolForSwap, tokens[0], tokens[1], amount)
        console.log('exchangeAmout', exchangeAmout)
        
        const getBestRate =  await swaps["get_best_rate(address,address,uint256)"](tokens[0], tokens[1], amount)
        console.log('getBestRate', getBestRate)
      } catch (error) {
        console.log(error)
      }
    }

    const coinCount = await registry.coin_count()
    console.log('coinCount', coinCount.toString())
  } else {
    console.error('Registry not deployed')
  }

}

healthCheck()