
import { ethers } from "ethers";

import { prepare_contract_abi } from "../../../utils/prepare_contracts";
import StableSwap3PoolJSON from '../../../build/contracts/StableSwap3Pool.json'
import { Pool } from '../../../src'

import { deployer } from "../deployment.godwoken";

function connectPool(poolAddress: string) {
  const pool = new ethers.Contract(
    poolAddress,
    JSON.stringify(prepare_contract_abi(StableSwap3PoolJSON.abi)),
    deployer.provider
  ).connect(deployer) as Pool;

  return pool
}

export async function poolMethodHealthCheck(poolAddress: string) {

  console.log("##### [POOL] POOL HEALTH CHECK #######")
  const pool = connectPool(poolAddress)
  
  let balance0 = await pool.balances(0)
  let balance1 = await pool.balances(1)
  let balance2 = await pool.balances(2)

  console.log('Balances',
    balance0.toString(),
    balance1.toString(),
    balance2.toString()
  )

  let coins0 = await pool.coins(0)
  let coins1 = await pool.coins(1)
  let coins2 = await pool.coins(2)

  console.log('Coins',
    coins0,
    coins1,
    coins2
  )
  console.log("############ [POOL] ##############")
  console.log("\n")
}

