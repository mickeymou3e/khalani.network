import { log } from '@graphprotocol/graph-ts'
import { SwapTemplateBase } from '../../generated/Registry/SwapTemplateBase'
import { PoolAdded, PoolRemoved, Registry } from '../../generated/Registry/Registry'
import * as Schemas from '../../generated/schema'
import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { ETH_ZERO_ADDRESS } from '../constants'
import { ERC20 } from '../../generated/Registry/ERC20'
import { store } from '@graphprotocol/graph-ts'
import { updateUsedBlock } from '../utils/block'
export { handleBlock } from './block'

function createOrLoadPoolToken(poolAddress: Address, address: Address, isLpToken: boolean): Schemas.PoolToken {
  let id = address.toHexString()
  let token = Schemas.PoolToken.load(id)

  if (!token) {
    token = new Schemas.PoolToken(id)

    let erc = ERC20.bind(address)
    let decimals = erc.try_decimals()
    let symbol = erc.try_symbol()

    token.symbol = symbol.reverted ? 'unknown' : symbol.value
    token.decimals = decimals.reverted ? BigInt.fromI32(0) : BigInt.fromI32(decimals.value)
    token.address = address
    token.isLpToken = isLpToken
    token.pools = [poolAddress.toHexString()]
    token.save()
  } else {
    let pools = token.pools || []
    if (pools) {
      let addPoolToTokenList = true

      for (let i = 0; i < pools.length; ++i) {
        if (pools[i] == poolAddress.toHexString()) {
          addPoolToTokenList = false
        }
      }

      if (addPoolToTokenList) {
        pools.push(poolAddress.toHexString())
      }

      token.pools = pools
      token.save()
    }
  }

  return token as Schemas.PoolToken
}

function addSwapPossibility(tokenAddress: Address, quoteTokens: Address[]): Schemas.SwapPossibility {
  let id = tokenAddress.toHexString()
  let swapPossibility = Schemas.SwapPossibility.load(id)

  if (!swapPossibility) {
    swapPossibility = new Schemas.SwapPossibility(id)
  }

  let quotes = swapPossibility.quotes
  let newQuotes: string[] = []

  if (quotes && quotes.length > 0) {
    for (let i = 0; i < quotes.length; ++i) {
      newQuotes.push(quotes[i])
    }
  }

  for (let i = 0; i < quoteTokens.length; ++i) {
    let isInsideQuote = false
    for (let j = 0; j < newQuotes.length; ++j) {
      if (newQuotes[j] == quoteTokens[i].toHexString()) {
        isInsideQuote = true
      }
    }

    if (!isInsideQuote && quoteTokens[i] != tokenAddress && quoteTokens[i] != Address.fromString(ETH_ZERO_ADDRESS)) {
      newQuotes.push(quoteTokens[i].toHexString())
    }
  }

  swapPossibility.quotes = newQuotes
  swapPossibility.save()

  return swapPossibility as Schemas.SwapPossibility
}

function createRegistry(registryAddress: Address): Schemas.Registry {
  let registrySchema = new Schemas.Registry(registryAddress.toHexString())
  registrySchema.pools = []
  registrySchema.save()

  return registrySchema
}

function createOrLoadRegistry(registryAddress: Address): Schemas.Registry {
  let registrySchema = Schemas.Registry.load(registryAddress.toHexString())
  if (!registrySchema) {
    registrySchema = createRegistry(registryAddress)
  }

  return registrySchema
}

function createOrLoadPool(registry: Schemas.Registry, poolAddress: Address, timestamp: BigInt): Schemas.Pool | null {
  let registryAddress = Address.fromString(registry.id)
  let poolSchema = Schemas.Pool.load(poolAddress.toHexString())

  if (!poolSchema) {
    let registry = Registry.bind(registryAddress)
    let pool = SwapTemplateBase.bind(poolAddress)

    let poolName = registry.try_get_pool_name(poolAddress)
    let rampA = registry.get_A(poolAddress)
    let lpTokenAddress = registry.get_lp_token(poolAddress)
    let fee = pool.fee()
    let adminFee = pool.admin_fee()
    let lpToken = createOrLoadPoolToken(poolAddress, lpTokenAddress, true)
    let tokens = registry.get_coins(poolAddress)

    let poolSchema = new Schemas.Pool(poolAddress.toHexString())
    let tokenIds: string[] = []
    let poolTokenIds: string[] = []

    for (let i = 0; i < tokens.length; ++i) {
      if (tokens[i] != Address.fromString(ETH_ZERO_ADDRESS)) {
        let poolTokenBalanceId = poolAddress.toHexString() + tokens[i].toHexString()
        let poolTokenBalanceSchema = new Schemas.PoolTokenBalance(poolTokenBalanceId)

        poolTokenIds.push(poolTokenBalanceId)
        addSwapPossibility(tokens[i], tokens)
        let token = createOrLoadPoolToken(poolAddress, tokens[i], false)
        if (token) {
          tokenIds.push(token.address.toHexString())
        }

        poolTokenBalanceSchema.balance = BigInt.fromI32(0)

        let tokenSchema = Schemas.PoolToken.load(tokens[i].toHexString())
        if (tokenSchema != null) {
          poolTokenBalanceSchema.decimals = tokenSchema.decimals || BigInt.fromI32(0)
          poolTokenBalanceSchema.save()
        }
      }
    }

    let tokenOrderIds: Bytes[] = []
    for (let i = 0; i < tokens.length; ++i) {
      if (tokens[i] != Address.fromString(ETH_ZERO_ADDRESS)) {
        tokenOrderIds.push(tokens[i])
      }
    }

    poolSchema.name = poolName.reverted ? 'unknown' : poolName.value
    poolSchema.rampA = rampA
    poolSchema.fee = fee
    poolSchema.adminFee = adminFee
    poolSchema.lpToken = lpToken.id
    poolSchema.tokens = tokenIds
    poolSchema.tokensOrder = tokenOrderIds
    poolSchema.createdAt = timestamp
    poolSchema.poolTokensBalances = poolTokenIds
    poolSchema.save()

    return poolSchema as Schemas.Pool
  }

  return null
}

export function poolRemovedHandler(event: PoolRemoved): void {
  let poolAddress = event.params.pool.toHexString()
  let pool = Schemas.Pool.load(poolAddress)
  let tokensToRemove: string[] = []

  if (pool) {
    tokensToRemove.push(pool.lpToken)
    store.remove('PoolToken', pool.lpToken)
    let tokens = pool.tokens || []
    if (tokens) {
      for (let i = 0; i < tokens.length; ++i) {
        let tokenAddress = tokens[i]
        let tokenPool = Schemas.PoolToken.load(tokenAddress)
        if (tokenPool) {
          let poolTokens = tokenPool.pools || []
          if (poolTokens && poolTokens.length == 1 && poolTokens[0] == poolAddress) {
            tokensToRemove.push(tokenPool.address.toHexString())
            store.remove('PoolToken', tokenPool.address.toHexString())
          }
        }
      }
    }
  }

  for (let i = 0; i < tokensToRemove.length; ++i) {
    store.remove('SwapPossibility', tokensToRemove[i])
  }

  let registry = createOrLoadRegistry(event.address)

  let newPools: string[] = []
  let currentPools = registry.pools || []

  if (currentPools) {
    for (let i = 0; i < currentPools.length; ++i) {
      if (currentPools[i] !== poolAddress) {
        newPools.push(currentPools[i])
      }
    }

    registry.pools = newPools
    registry.save()
  }

  if (pool) {
    store.remove('Pool', pool.id)
  }
  updateUsedBlock(event.block.number, event.block.hash)
}

export function poolAddedHandler(event: PoolAdded): void {
  let registry = createOrLoadRegistry(event.address)
  let pool = createOrLoadPool(registry, event.params.pool, event.block.timestamp)
  if (pool) {
    let pools = registry.pools || []
    if (pools) {
      pools.push(event.params.pool.toHexString())
      registry.pools = pools
      registry.save()
    }
  }
  updateUsedBlock(event.block.number, event.block.hash)
}
