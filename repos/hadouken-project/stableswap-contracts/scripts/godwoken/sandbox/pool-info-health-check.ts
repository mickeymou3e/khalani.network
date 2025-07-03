require('dotenv').config()

import { deployer, transactionOverrides } from "../deployment.godwoken";
import { connectRegistry, connectPoolInfo } from '../registry'

async function healthCheck() {
  const registry = await connectRegistry('godwoken.local.dev', deployer)
  const poolInfo = await connectPoolInfo('godwoken.local.dev', deployer)

  if(poolInfo && registry) {
    const pool = await registry.pool_list(0)
    console.log(`Pool ${pool}`)
    try {
      const poolCoinsResult = await poolInfo.get_pool_coins(pool, transactionOverrides)
      console.log('poolCoinsResult', poolCoinsResult.map(poolCoin => poolCoin.toString()))
    } catch(error) {
      console.error('get_pool_coins', error)
    }
    try {
      const poolInfoResult = await poolInfo.get_pool_info(pool, transactionOverrides)
      console.log('poolInfoResult', poolInfoResult)
    } catch(error) {
      console.error('get_pool_info', error)
    }

    console.log('Success')
    return
  }

  console.error('Error: Registry not deployed')
}

healthCheck()