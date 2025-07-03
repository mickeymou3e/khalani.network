require('dotenv').config()

import { BigNumber, constants } from "ethers";
import { deployer, transactionOverrides } from "../deployment.godwoken";
import { connectSwaps, connectRegistry } from "../connect";
import { addressTranslator } from '../godwoken.utils'
import { approveToken, mintToken } from "../tokens";
import { getRegistryData } from "../registry";

async function healthCheck() {
  const admin = addressTranslator.ethAddressToGodwokenShortAddress(deployer.address)

  const registryData = getRegistryData('godwoken.local.dev')

  let swaps, registry

  if(registryData) {
    swaps = await connectSwaps(registryData.swaps_address, deployer)
    registry = await connectRegistry(registryData.registry_address, deployer)
  }

  if(swaps && registry) {
    console.log('Swas address', swaps.address)
    console.log('Registry address', registry.address)

    const poolAddress = await registry.pool_list(0)
    console.log(`Pool ${poolAddress}`)
    const tokensAddresses = await registry.get_coins(poolAddress, transactionOverrides)
    console.log(`Tokens ${tokensAddresses}`)
    
    const tokensAmounts: BigNumber[] = []
    for(
      let i = 0;
      i < tokensAddresses.filter(tokenAddress => tokenAddress !== constants.AddressZero).length;
      i++
    ) {
      let tokenAddress = tokensAddresses[i]

      try {
        const tokenAmount = await mintToken(
          'godwoken.local.dev',
          tokenAddress,
          admin,
          deployer,
          transactionOverrides
        )
        console.log(`Amount to deposit ${tokenAddress}`, tokenAmount.toString())

        await approveToken(
          tokenAddress,
          tokenAmount,
          swaps.address,
          admin,
          deployer,
          transactionOverrides
        )

        tokensAmounts.push(tokenAmount)
      } catch(error) {
        console.error('Tokens amounts', error)
      }
    }

    console.log('Tokens Amounts', tokensAmounts.map(tokenAmount => tokenAmount.toString()))

    try {
      const getBestRate = swaps["get_best_rate(address,address,uint256)"]
      const bestExchangeRate = await getBestRate(
        tokensAddresses[0],
        tokensAddresses[1],
        tokensAmounts[0],
        transactionOverrides
      )
      console.log('bestExchangeRate pool', bestExchangeRate[0])
      console.log('bestExchangeRate amount', bestExchangeRate[1].toString())
    } catch(error) {
      console.error('get_best_rate', error)
    }
    
    const poolBalanceBeforeExchange = await registry.get_balances(poolAddress, transactionOverrides)
    console.log(
      'pool balance',
      poolBalanceBeforeExchange.map(tokenBalance => tokenBalance.toString())
    )

    const foundedPool = await registry["find_pool_for_coins(address,address)"](
      tokensAddresses[0],
      tokensAddresses[1],
    )
    console.log('pool from registry', foundedPool)

    try {
      console.log('exchange with swaps', tokensAddresses[0], tokensAddresses[1])
      const exchange = swaps["exchange(address,address,address,uint256,uint256)"]
      const exchangeTransaction = await exchange(
        foundedPool,
        tokensAddresses[0],
        tokensAddresses[1],
        tokensAmounts[0],
        BigNumber.from(0),
        transactionOverrides
      )
      console.log('transaction', exchangeTransaction.hash)
      await exchangeTransaction.wait()

      const poolBalanceAfterExchange = await registry.get_balances(poolAddress, transactionOverrides)
      console.log(
        'pool balance',
        poolBalanceAfterExchange.map(tokenBalance => tokenBalance.toString())
      )
    } catch(error) {
      console.error('exchange_with_swaps', error)
    }

    try {
      console.log('exchange with best rate', tokensAddresses[0], tokensAddresses[1])
      
      for(
        let i = 0;
        i < tokensAddresses.filter(tokenAddress => tokenAddress !== constants.AddressZero).length;
        i++
      ) {
        let tokenAddress = tokensAddresses[i]
  
        try {
          const tokenAmount = await mintToken(
            'godwoken.local.dev',
            tokenAddress,
            admin,
            deployer,
            transactionOverrides
          )
          console.log(`Amount to deposit ${tokenAddress}`, tokenAmount.toString())
  
          await approveToken(
            tokenAddress,
            tokenAmount,
            swaps.address,
            admin,
            deployer,
            transactionOverrides
          )
  
          tokensAmounts.push(tokenAmount)
        } catch(error) {
          console.error('Tokens amounts', error)
        }
      }
      
      
      const exchangeWithBestRate = swaps["exchange_with_best_rate(address,address,uint256,uint256)"]
      const exchangeTransaction = await exchangeWithBestRate(
        tokensAddresses[0],
        tokensAddresses[1],
        tokensAmounts[0],
        BigNumber.from(0),
        transactionOverrides
      )
      console.log('transaction', exchangeTransaction.hash)
      await exchangeTransaction.wait()

      const poolBalanceAfterExchange = await registry.get_balances(poolAddress, transactionOverrides)
      console.log(
        'pool balance',
        poolBalanceAfterExchange.map(tokenBalance => tokenBalance.toString())
      )
    } catch(error) {
      console.error('exchange_with_best_rate', error)
    }


    console.log('Success')
    return
  }

  console.error('Error: Registry not deployed')
}

healthCheck()
