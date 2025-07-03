import { Address, Bytes, log } from '@graphprotocol/graph-ts'
import { Pool } from '../../../types/schema'

import { VAULT_ADDRESS } from './constants'
import { Vault } from '../../../types/Vault/Vault'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PoolType {
  export const Weighted = 'Weighted'
  export const Stable = 'Stable'
  export const MetaStable = 'MetaStable'
  export const StablePhantom = 'StablePhantom'
  export const ComposableStable = 'ComposableStable'
  export const AaveLinear = 'AaveLinear'
}

export function isVariableWeightPool(pool: Pool): boolean {
  return false
}

export function hasVirtualSupply(pool: Pool): boolean {
  return (
    pool.poolType == PoolType.AaveLinear ||
    pool.poolType == PoolType.StablePhantom ||
    pool.poolType == PoolType.ComposableStable
  )
}

export function isStableLikePool(pool: Pool): boolean {
  return (
    pool.poolType == PoolType.Stable ||
    pool.poolType == PoolType.MetaStable ||
    pool.poolType == PoolType.StablePhantom ||
    pool.poolType == PoolType.ComposableStable
  )
}

export function getPoolAddress(poolId: string): Address {
  return changetype<Address>(Address.fromHexString(poolId.slice(0, 42)))
}

export function getPoolTokens(poolId: Bytes): Bytes[] | null {
  let vaultContract = Vault.bind(VAULT_ADDRESS)
  let tokensCall = vaultContract.try_getPoolTokens(poolId)

  if (tokensCall.reverted) {
    log.warning('Failed to get pool tokens: {}', [poolId.toHexString()])
    return null
  }

  let tokensValue = tokensCall.value.value0
  let tokens = changetype<Bytes[]>(tokensValue)

  return tokens
}

export function getPoolTokenManager(
  poolId: Bytes,
  tokenAddress: Bytes
): Address | null {
  let token = changetype<Address>(tokenAddress)

  let vaultContract = Vault.bind(VAULT_ADDRESS)
  let managersCall = vaultContract.try_getPoolTokenInfo(poolId, token)

  if (managersCall.reverted) {
    log.warning('Failed to get pool token info: {} {}', [
      poolId.toHexString(),
      token.toHexString()
    ])
    return null
  }

  let assetManager = managersCall.value.value3

  return assetManager
}
