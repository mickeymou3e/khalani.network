require('dotenv').config()

import { BigNumber } from '@ethersproject/bignumber';

import StableSwap3Pool_JSON from '../../../build/contracts/StableSwap3Pool.json'

import { deployer, transactionOverrides } from "../deployment.godwoken";
import { connectPool, connectRegistry } from '../connect'
import { addressTranslator } from '../godwoken.utils'

import { getRegistryData } from '../registry';
import { approveToken, mintToken } from '../tokens';
import { constants } from 'ethers';
import { getDeploymentDataPath } from '../utils';
import { POOLS_CONTRACTS_DIR } from '../pools/constants';

async function healthCheck() {
  const admin = addressTranslator.ethAddressToGodwokenShortAddress(deployer.address)

  const registryData = getDeploymentDataPath(POOLS_CONTRACTS_DIR, network)
  let registry
  
  if (registryData) {
    registry = await connectRegistry(registryData.registry_address, deployer)
  }
  
  if (registry) {
    console.log('registry address', registry.address)
    const poolCount = await registry.pool_count(transactionOverrides)

    if (poolCount.eq(0)) {
      throw new Error('no pool in registry')
    }

    const poolAddress = await registry.pool_list(0, transactionOverrides)
    console.log('pool', poolAddress)

    const pool = connectPool(poolAddress, StableSwap3Pool_JSON.abi, deployer)
    const tokensRaw = await registry.get_coins(poolAddress, transactionOverrides)
    console.log('tokens raw', tokensRaw)

    const notZero = (x: string) => x !== constants.AddressZero
    const tokens = tokensRaw.filter(notZero)
    console.log('tokens', tokens)

    const tokensAmounts: BigNumber[] = []
    for (let token of tokens) {
      console.log('token', token)
      try {
        const tokenAmount = await mintToken(
          'godwoken.local.dev',
          token,
          admin,
          deployer,
          transactionOverrides
        )
        console.log(`Amount to deposit ${token}`, tokenAmount.toString())

        await approveToken(
          token,
          tokenAmount,
          pool.address,
          admin,
          deployer,
          transactionOverrides
        )

        tokensAmounts.push(tokenAmount)
      } catch(error) {
        console.error('tokens amounts', error)
      }
    }
    console.log('add initial liquidity', pool.address, tokensAmounts.map(amount => amount.toString()))

    const addLiquidityRequest = await pool.add_liquidity(tokensAmounts, BigNumber.from(0), transactionOverrides)
    console.log('add initial liquidity request', addLiquidityRequest.hash)
  
    const addLiquidityReceipt = await addLiquidityRequest.wait()
    console.log('initial liquidity added', addLiquidityReceipt.transactionHash)

    console.log('success')
  }
  console.error('registry not deployed')
}

healthCheck()