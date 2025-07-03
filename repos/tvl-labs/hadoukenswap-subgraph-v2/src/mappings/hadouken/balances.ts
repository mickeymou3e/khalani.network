import { PoolTokenBalance} from '../../types/schema'
import { BigInt } from '@graphprotocol/graph-ts'
import { Pool } from '../../types/schema'

export function swap(poolId: string, tokens: string[], amounts: BigInt[]) {
  let pool = Pool.load(poolId)

  let [ tokenIn, tokenOut ] = tokens
  let [ amountIn, amountOut ] = amounts

  if (pool) {
    let tokensAddresses = pool.tokens

    if (
      tokensAddresses &&
      tokensAddresses.includes(tokenIn) &&
      tokensAddresses.includes(tokenOut) &&
      tokens.length === 2 && amounts.length === 2 
    ) {
        let tokenInBalanceSchema = PoolTokenBalance.load(poolId + tokenIn)
        if (tokenInBalanceSchema) {
          tokenInBalanceSchema.balance = tokenInBalanceSchema.balance.plus(amountIn)
          tokenInBalanceSchema.save()
        }

        let tokenOutBalanceSchema = PoolTokenBalance.load(poolId + amountOut)
        if (tokenOutBalanceSchema) {
          tokenOutBalanceSchema.balance = tokenOutBalanceSchema.balance.minus(amountOut)
          tokenOutBalanceSchema.save()
        }
    }
  }
}


export function addLiquidity(poolId: string, amounts: BigInt[]): void {
  let pool = Pool.load(poolId)

  if (pool) {
    let tokensAddresses = pool.tokens

    if (tokensAddresses && tokensAddresses.length > 0) {
      for (let i = 0; i < tokensAddresses.length; ++i) {
        let tokenAddress = tokensAddresses[i]
        let tokenBalanceSchema = PoolTokenBalance.load(poolId + tokenAddress)

        if (tokenBalanceSchema) {
          tokenBalanceSchema.balance = tokenBalanceSchema.balance.plus(amounts[i])
          tokenBalanceSchema.save()
        }
      }
    }
  }
}

export function removeLiquidity(poolId: string, amounts: BigInt[]): void {
  let pool = Pool.load(poolId)

  if (pool) {
    let tokensAddresses = pool.tokens

    if (tokensAddresses && tokensAddresses.length > 0) {
      for (let i = 0; i < tokensAddresses.length; ++i) {
        let tokenAddress = tokensAddresses[i]
        let tokenBalanceSchema = PoolTokenBalance.load(poolId + tokenAddress)

        if (tokenBalanceSchema) {
          tokenBalanceSchema.balance = tokenBalanceSchema.balance.minus(amounts[i])
          tokenBalanceSchema.save()
        }
      }
    }
  }
}