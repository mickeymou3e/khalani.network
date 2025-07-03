import * as Schemas from '../../generated/schema'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { ERC20 } from '../../generated/SwapTemplateBase/ERC20'

export function addLiquidity(poolAddress: Address, newBalances: BigInt[]): void {
  let poolSchema = Schemas.Pool.load(poolAddress.toHexString())

  if (poolSchema) {
    let tokensOrder = poolSchema.tokensOrder

    if (tokensOrder && tokensOrder.length > 0) {
      for (let i = 0; i < tokensOrder.length; ++i) {
        let tokenAddress = tokensOrder[i]
        let tokenBalanceSchema = Schemas.PoolTokenBalance.load(poolAddress.toHexString() + tokenAddress.toHexString())

        if (tokenBalanceSchema) {
          tokenBalanceSchema.balance = tokenBalanceSchema.balance.plus(newBalances[i])
          tokenBalanceSchema.save()
        }
      }
    }
  }
}

export function removeLiquidity(poolAddress: Address, newBalances: BigInt[]): void {
  let poolSchema = Schemas.Pool.load(poolAddress.toHexString())

  if (poolSchema) {
    let tokensOrder = poolSchema.tokensOrder

    if (tokensOrder && tokensOrder.length > 0) {
      for (let i = 0; i < tokensOrder.length; ++i) {
        let tokenAddress = tokensOrder[i]
        let tokenBalanceSchema = Schemas.PoolTokenBalance.load(poolAddress.toHexString() + tokenAddress.toHexString())

        if (tokenBalanceSchema) {
          tokenBalanceSchema.balance = tokenBalanceSchema.balance.minus(newBalances[i])
          tokenBalanceSchema.save()
        }
      }
    }
  }
}

export function removeLiquidityOne(poolAddress: Address): void {
  let poolSchema = Schemas.Pool.load(poolAddress.toHexString())

  if (poolSchema) {
    let tokensAddress = poolSchema.tokensOrder

    if (tokensAddress && tokensAddress.length > 0) {
      for (let i = 0; i < tokensAddress.length; ++i) {
        let tokenAddress = Address.fromString(tokensAddress[i].toHexString())
        const erc20Contract = ERC20.bind(tokenAddress)
        const balanceOfContractCall = erc20Contract.try_balanceOf(poolAddress)

        if (!balanceOfContractCall.reverted) {
          let tokenBalanceSchema = Schemas.PoolTokenBalance.load(poolAddress.toHexString() + tokenAddress.toHexString())

          if (tokenBalanceSchema) {
            tokenBalanceSchema.balance = balanceOfContractCall.value
            tokenBalanceSchema.save()
          }
        }
      }
    }
  }
}
