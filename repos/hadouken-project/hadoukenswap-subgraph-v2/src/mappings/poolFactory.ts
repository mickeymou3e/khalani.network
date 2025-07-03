import { FX_AGGREGATOR_ADDRESSES, ZERO, ZERO_BD } from './helpers/constants'
import {
  PoolType,
  getPoolTokenManager,
  getPoolTokens,
  isMetaStableDeprecated,
  setPriceRateProviders
} from './helpers/pools'

import {
  createPoolTokenEntity,
  getBalancerSnapshot,
  newPoolEntity,
  scaleDown,
  stringToBytes,
  tokenToDecimal
} from './helpers/misc'
import { updatePoolWeights } from './helpers/weighted'

import {
  Address,
  BigDecimal,
  BigInt,
  Bytes,
  ethereum
} from '@graphprotocol/graph-ts'
import { AaveLinearPoolCreated } from '../types/AaveLinearPoolV3Factory/AaveLinearPoolV3Factory'
import { ProtocolIdRegistered } from '../types/ProtocolIdRegistry/ProtocolIdRegistry'
import { PoolCreated } from '../types/WeightedPoolFactory/WeightedPoolFactory'
import { Balancer, Pool, PoolContract, ProtocolIdData } from '../types/schema'

// datasource
import {
  ConvergentCurvePool as CCPoolTemplate,
  FXPool as FXPoolTemplate,
  Gyro2Pool as Gyro2PoolTemplate,
  Gyro3Pool as Gyro3PoolTemplate,
  GyroEPool as GyroEPoolTemplate,
  InvestmentPool as InvestmentPoolTemplate,
  LinearPool as LinearPoolTemplate,
  LiquidityBootstrappingPool as LiquidityBootstrappingPoolTemplate,
  MetaStablePool as MetaStablePoolTemplate,
  OffchainAggregator,
  StablePhantomPool as StablePhantomPoolTemplate,
  StablePhantomPoolV2 as StablePhantomPoolV2Template,
  StablePool as StablePoolTemplate,
  WeightedPool2Tokens as WeightedPool2TokensTemplate,
  WeightedPoolNew as WeightedPoolNewTemplate,
  WeightedPool as WeightedPoolTemplate
} from '../types/templates'

import { ERC20 } from '../types/Vault/ERC20'
import { ConvergentCurvePool } from '../types/templates/ConvergentCurvePool/ConvergentCurvePool'
import { Gyro2Pool } from '../types/templates/Gyro2Pool/Gyro2Pool'
import { Gyro3Pool } from '../types/templates/Gyro3Pool/Gyro3Pool'
import { GyroEPool } from '../types/templates/GyroEPool/GyroEPool'
import { LinearPool } from '../types/templates/LinearPool/LinearPool'
import { StablePool } from '../types/templates/StablePool/StablePool'
import { WeightedPool } from '../types/templates/WeightedPool/WeightedPool'
import { whitelist } from './helpers/assets'

function createWeightedLikePool(
  event: PoolCreated,
  poolType: string,
  poolTypeVersion: i32 = 1
): string | null {
  let poolAddress: Address = event.params.pool
  let poolContract = WeightedPool.bind(poolAddress)

  let poolIdCall = poolContract.try_getPoolId()
  let poolId = poolIdCall.value

  let swapFeeCall = poolContract.try_getSwapFeePercentage()
  let swapFee = swapFeeCall.value

  let ownerCall = poolContract.try_getOwner()
  let owner = ownerCall.value

  let pool = handleNewPool(event, poolId, swapFee)
  pool.poolType = poolType
  pool.poolTypeVersion = poolTypeVersion
  pool.owner = owner

  let tokens = getPoolTokens(poolId)
  if (tokens == null) return null
  pool.tokensList = tokens

  pool.save()

  handleNewPoolTokens(pool, tokens)

  // Load pool with initial weights
  updatePoolWeights(poolId.toHexString())

  // Create PriceRateProvider entities for WeightedPoolNew
  if (poolTypeVersion == 2)
    setPriceRateProviders(poolId.toHex(), poolAddress, tokens)

  return poolId.toHexString()
}

export function handleNewWeightedPool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  const pool = createWeightedLikePool(event, PoolType.Weighted)
  if (pool == null) return
  WeightedPoolTemplate.create(event.params.pool)
}

export function handleNewWeightedPoolNew(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  const pool = createWeightedLikePool(event, PoolType.Weighted, 2)
  if (pool == null) return
  WeightedPoolNewTemplate.create(event.params.pool)
}

export function handleNewWeightedPoolV3(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  const pool = createWeightedLikePool(event, PoolType.Weighted, 3)
  if (pool == null) return
  WeightedPoolNewTemplate.create(event.params.pool)
}

export function handleNewWeightedPoolV4(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  const pool = createWeightedLikePool(event, PoolType.Weighted, 4)
  if (pool == null) return
  WeightedPoolNewTemplate.create(event.params.pool)
}

export function handleNewWeighted2TokenPool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  createWeightedLikePool(event, PoolType.Weighted)
  WeightedPool2TokensTemplate.create(event.params.pool)
}

export function handleNewLiquidityBootstrappingPool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  const pool = createWeightedLikePool(event, PoolType.LiquidityBootstrapping)
  if (pool == null) return
  LiquidityBootstrappingPoolTemplate.create(event.params.pool)
}

export function handleNewInvestmentPool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  const pool = createWeightedLikePool(event, PoolType.Investment)
  if (pool == null) return
  InvestmentPoolTemplate.create(event.params.pool)
}

function createStableLikePool(
  event: PoolCreated,
  poolType: string,
  poolTypeVersion: i32 = 1
): string | null {
  let poolAddress: Address = event.params.pool
  let poolContract = StablePool.bind(poolAddress)

  let poolIdCall = poolContract.try_getPoolId()
  let poolId = poolIdCall.value

  let swapFeeCall = poolContract.try_getSwapFeePercentage()
  let swapFee = swapFeeCall.value

  let ownerCall = poolContract.try_getOwner()
  let owner = ownerCall.value

  let pool = handleNewPool(event, poolId, swapFee)
  pool.poolType = poolType
  pool.poolTypeVersion = poolTypeVersion
  pool.owner = owner

  let tokens = getPoolTokens(poolId)
  if (tokens == null) return null
  pool.tokensList = tokens

  pool.save()

  handleNewPoolTokens(pool, tokens)

  return poolId.toHexString()
}

export function handleNewStablePool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  const pool = createStableLikePool(event, PoolType.Stable)
  if (pool == null) return
  StablePoolTemplate.create(event.params.pool)
}

export function handleNewStablePoolV2(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  const pool = createStableLikePool(event, PoolType.Stable, 2)
  if (pool == null) return
  StablePoolTemplate.create(event.params.pool)
}

export function handleNewMetaStablePool(event: PoolCreated): void {
  if (isMetaStableDeprecated(event.block.number.toI32())) return

  if (!whitelist.includes(event.params.pool)) {
    return
  }
  const pool = createStableLikePool(event, PoolType.MetaStable)
  if (pool == null) return
  MetaStablePoolTemplate.create(event.params.pool)
}

export function handleNewStablePhantomPool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  const pool = createStableLikePool(event, PoolType.StablePhantom)
  if (pool == null) return
  StablePhantomPoolTemplate.create(event.params.pool)
}

export function handleNewComposableStablePool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  const pool = createStableLikePool(event, PoolType.ComposableStable)
  if (pool == null) return
  StablePhantomPoolV2Template.create(event.params.pool)
}

export function handleNewComposableStablePoolNew(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  const pool = createStableLikePool(event, PoolType.ComposableStable, 2)
  if (pool == null) return
  StablePhantomPoolV2Template.create(event.params.pool)
}

export function handleNewComposableStablePoolV3(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  const pool = createStableLikePool(event, PoolType.ComposableStable, 3)
  if (pool == null) return
  StablePhantomPoolV2Template.create(event.params.pool)
}

export function handleNewComposableStablePoolV4(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  const pool = createStableLikePool(event, PoolType.ComposableStable, 4)
  if (pool == null) return
  StablePhantomPoolV2Template.create(event.params.pool)
}

export function handleNewHighAmpComposableStablePool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  const pool = createStableLikePool(event, PoolType.HighAmpComposableStable)
  if (pool == null) return
  StablePhantomPoolV2Template.create(event.params.pool)
}

export function handleNewCCPPool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  let poolAddress: Address = event.params.pool

  let poolContract = ConvergentCurvePool.bind(poolAddress)

  let poolIdCall = poolContract.try_getPoolId()
  let poolId = poolIdCall.value

  let swapFeeCall = poolContract.try_percentFee()
  let swapFee = swapFeeCall.value

  let principalTokenCall = poolContract.try_bond()
  let principalToken = principalTokenCall.value

  let baseTokenCall = poolContract.try_underlying()
  let baseToken = baseTokenCall.value

  let expiryTimeCall = poolContract.try_expiration()
  let expiryTime = expiryTimeCall.value

  let unitSecondsCall = poolContract.try_unitSeconds()
  let unitSeconds = unitSecondsCall.value

  // let ownerCall = poolContract.try_getOwner();
  // let owner = ownerCall.value;

  let pool = handleNewPool(event, poolId, swapFee)
  pool.poolType = PoolType.Element // pool.owner = owner;
  pool.principalToken = principalToken
  pool.baseToken = baseToken
  pool.expiryTime = expiryTime
  pool.unitSeconds = unitSeconds

  let tokens = getPoolTokens(poolId)
  if (tokens == null) return
  pool.tokensList = tokens

  pool.save()

  handleNewPoolTokens(pool, tokens)

  CCPoolTemplate.create(poolAddress)
}

export function handleNewAaveLinearPool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  handleNewLinearPool(event, PoolType.AaveLinear)
}

export function handleNewAaveLinearPoolV2(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  handleNewLinearPool(event, PoolType.AaveLinear, 2)
}

export function handleNewAaveLinearPoolV3(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  handleNewLinearPool(event, PoolType.AaveLinear, 3)
}

export function handleNewAaveLinearPoolV4(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  handleNewLinearPool(event, PoolType.AaveLinear, 4)
}

export function handleNewERC4626LinearPool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  handleNewLinearPool(event, PoolType.ERC4626Linear)
}

export function handleNewERC4626LinearPoolV3(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  handleNewLinearPool(event, PoolType.ERC4626Linear, 3)
}

export function handleNewEulerLinearPool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  handleNewLinearPool(event, PoolType.EulerLinear, 1)
}

export function handleNewGearboxLinearPool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  handleNewLinearPool(event, PoolType.GearboxLinear, 1)
}

export function handleNewMidasLinearPool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  handleNewLinearPool(event, PoolType.EulerLinear, 1)
}

export function handleNewReaperLinearPool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  handleNewLinearPool(event, PoolType.ReaperLinear, 1)
}

export function handleNewReaperLinearPoolV3(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  handleNewLinearPool(event, PoolType.ReaperLinear, 3)
}

export function handleNewSiloLinearPool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  handleNewLinearPool(event, PoolType.SiloLinear, 1)
}

export function handleNewYearnLinearPool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  handleNewLinearPool(event, PoolType.YearnLinear, 1)
}

export function handleLinearPoolProtocolId(event: AaveLinearPoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  let poolAddress = event.params.pool
  let poolContract = PoolContract.load(poolAddress.toHexString())
  if (poolContract == null) return

  let pool = Pool.load(poolContract.pool) as Pool
  pool.protocolId = event.params.protocolId.toI32()
  const protocolIdData = ProtocolIdData.load(event.params.protocolId.toString())
  pool.protocolIdData = protocolIdData ? protocolIdData.id : null
  pool.save()
}

function handleNewLinearPool(
  event: PoolCreated,
  poolType: string,
  poolTypeVersion: i32 = 1
): void {
  let poolAddress: Address = event.params.pool

  let poolContract = LinearPool.bind(poolAddress)

  let poolIdCall = poolContract.try_getPoolId()
  let poolId = poolIdCall.value

  let swapFeeCall = poolContract.try_getSwapFeePercentage()
  let swapFee = swapFeeCall.value

  let pool = handleNewPool(event, poolId, swapFee)

  pool.poolType = poolType
  pool.poolTypeVersion = poolTypeVersion

  let mainIndexCall = poolContract.try_getMainIndex()
  pool.mainIndex = mainIndexCall.value.toI32()
  let wrappedIndexCall = poolContract.try_getWrappedIndex()
  pool.wrappedIndex = wrappedIndexCall.value.toI32()

  let targetsCall = poolContract.try_getTargets()
  pool.lowerTarget = tokenToDecimal(targetsCall.value.value0, 18)
  pool.upperTarget = tokenToDecimal(targetsCall.value.value1, 18)

  let tokens = getPoolTokens(poolId)
  if (tokens == null) return
  pool.tokensList = tokens

  let maxTokenBalance = BigDecimal.fromString(
    '5192296858534827.628530496329220095'
  )
  pool.totalShares = pool.totalShares.minus(maxTokenBalance)
  pool.save()

  handleNewPoolTokens(pool, tokens)

  LinearPoolTemplate.create(poolAddress)
}

export function handleNewGyro2Pool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  let poolAddress: Address = event.params.pool

  let poolContract = Gyro2Pool.bind(poolAddress)

  let poolIdCall = poolContract.try_getPoolId()
  let poolId = poolIdCall.value

  let swapFeeCall = poolContract.try_getSwapFeePercentage()
  let swapFee = swapFeeCall.value

  let pool = handleNewPool(event, poolId, swapFee)

  pool.poolType = PoolType.Gyro2
  let sqrtParamsCall = poolContract.try_getSqrtParameters()
  pool.sqrtAlpha = scaleDown(sqrtParamsCall.value[0], 18)
  pool.sqrtBeta = scaleDown(sqrtParamsCall.value[1], 18)

  let tokens = getPoolTokens(poolId)
  if (tokens == null) return
  pool.tokensList = tokens

  pool.save()

  handleNewPoolTokens(pool, tokens)

  Gyro2PoolTemplate.create(event.params.pool)
}

export function handleNewGyro3Pool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  let poolAddress: Address = event.params.pool

  let poolContract = Gyro3Pool.bind(poolAddress)

  let poolIdCall = poolContract.try_getPoolId()
  let poolId = poolIdCall.value

  let swapFeeCall = poolContract.try_getSwapFeePercentage()
  let swapFee = swapFeeCall.value

  let pool = handleNewPool(event, poolId, swapFee)

  pool.poolType = PoolType.Gyro3
  let root3AlphaCall = poolContract.try_getRoot3Alpha()

  if (!root3AlphaCall.reverted) {
    pool.root3Alpha = scaleDown(root3AlphaCall.value, 18)
  }

  let tokens = getPoolTokens(poolId)
  if (tokens == null) return
  pool.tokensList = tokens

  pool.save()

  handleNewPoolTokens(pool, tokens)

  Gyro3PoolTemplate.create(event.params.pool)
}

export function handleNewGyroEPool(event: PoolCreated): void {
  if (!whitelist.includes(event.params.pool)) {
    return
  }
  let poolAddress: Address = event.params.pool
  let poolContract = GyroEPool.bind(poolAddress)

  let poolIdCall = poolContract.try_getPoolId()
  let poolId = poolIdCall.value

  let swapFeeCall = poolContract.try_getSwapFeePercentage()
  let swapFee = swapFeeCall.value

  let pool = handleNewPool(event, poolId, swapFee)

  pool.poolType = PoolType.GyroE
  let eParamsCall = poolContract.try_getECLPParams()

  if (!eParamsCall.reverted) {
    const params = eParamsCall.value.value0
    const derived = eParamsCall.value.value1
    pool.alpha = scaleDown(params.alpha, 18)
    pool.beta = scaleDown(params.beta, 18)
    pool.c = scaleDown(params.c, 18)
    pool.s = scaleDown(params.s, 18)
    pool.lambda = scaleDown(params.lambda, 18)

    // terms in the 'derived' object are stored in extra precision (38 decimals) with final decimal rounded down
    pool.tauAlphaX = scaleDown(derived.tauAlpha.x, 38)
    pool.tauAlphaY = scaleDown(derived.tauAlpha.y, 38)
    pool.tauBetaX = scaleDown(derived.tauBeta.x, 38)
    pool.tauBetaY = scaleDown(derived.tauBeta.y, 38)
    pool.u = scaleDown(derived.u, 38)
    pool.v = scaleDown(derived.v, 38)
    pool.w = scaleDown(derived.w, 38)
    pool.z = scaleDown(derived.z, 38)
    pool.dSq = scaleDown(derived.dSq, 38)
  }

  let tokens = getPoolTokens(poolId)
  if (tokens == null) return
  pool.tokensList = tokens

  pool.save()

  handleNewPoolTokens(pool, tokens)

  GyroEPoolTemplate.create(event.params.pool)
}

export function handleNewFXPool(event: ethereum.Event): void {
  /**
   * FXPoolFactory emits a custom NewFXPool event with the following params:
   *   event.parameters[0] = caller
   *   event.parameters[1] = id (vault poolId)
   *   event.parameters[2] = fxpool (pool address)
   * */
  let poolId = event.parameters[1].value.toBytes()
  let poolAddress = event.parameters[2].value.toAddress()
  let swapFee = ZERO // @todo: figure out how to get swap fee from FXPool

  // Create a PoolCreated event from generic ethereum.Event
  const poolCreatedEvent = new PoolCreated(
    event.address,
    event.logIndex,
    event.transactionLogIndex,
    event.logType,
    event.block,
    event.transaction,
    [event.parameters[2]], // PoolCreated expects parameters[0] to be the pool address,
    event.receipt
  )

  let pool = handleNewPool(poolCreatedEvent, poolId, swapFee)

  pool.poolType = PoolType.FX

  let tokens = getPoolTokens(poolId)
  if (tokens == null) return
  pool.tokensList = tokens

  pool.save()

  handleNewPoolTokens(pool, tokens)

  FXPoolTemplate.create(poolAddress)

  // Create templates for every Offchain Aggregator
  for (let i: i32 = 0; i < FX_AGGREGATOR_ADDRESSES.length; i++) {
    OffchainAggregator.create(FX_AGGREGATOR_ADDRESSES[i])
  }
}

function findOrInitializeVault(): Balancer {
  let vault: Balancer | null = Balancer.load('2')
  if (vault != null) return vault

  // if no vault yet, set up blank initial
  vault = new Balancer('2')
  vault.poolCount = 0
  vault.totalLiquidity = ZERO_BD
  vault.totalSwapVolume = ZERO_BD
  vault.totalSwapFee = ZERO_BD
  vault.totalSwapCount = ZERO
  return vault
}

function handleNewPool(
  event: PoolCreated,
  poolId: Bytes,
  swapFee: BigInt
): Pool {
  let poolAddress: Address = event.params.pool

  let pool = Pool.load(poolId.toHexString())
  if (pool == null) {
    pool = newPoolEntity(poolId.toHexString())

    pool.swapFee = scaleDown(swapFee, 18)
    pool.createTime = event.block.timestamp.toI32()
    pool.address = poolAddress
    pool.factory = event.address
    pool.oracleEnabled = false
    pool.tx = event.transaction.hash
    pool.swapEnabled = true
    pool.isPaused = false

    let bpt = ERC20.bind(poolAddress)

    let nameCall = bpt.try_name()
    if (!nameCall.reverted) {
      pool.name = nameCall.value
    }

    let symbolCall = bpt.try_symbol()
    if (!symbolCall.reverted) {
      pool.symbol = symbolCall.value
    }
    pool.save()

    let vault = findOrInitializeVault()
    vault.poolCount += 1
    vault.save()

    let vaultSnapshot = getBalancerSnapshot(
      vault.id,
      event.block.timestamp.toI32()
    )
    vaultSnapshot.poolCount += 1
    vaultSnapshot.save()
  }

  let poolContract = PoolContract.load(poolAddress.toHexString())
  if (poolContract == null) {
    poolContract = new PoolContract(poolAddress.toHexString())
    poolContract.pool = poolId.toHexString()
    poolContract.save()
  }

  return pool
}

function handleNewPoolTokens(pool: Pool, tokens: Bytes[]): void {
  let tokensAddresses = changetype<Address[]>(tokens)

  for (let i: i32 = 0; i < tokens.length; i++) {
    let poolId = stringToBytes(pool.id)
    let assetManager = getPoolTokenManager(poolId, tokens[i])

    if (!assetManager) continue

    createPoolTokenEntity(pool, tokensAddresses[i], i, assetManager)
  }
}

export function handleProtocolIdRegistryOrRename(
  event: ProtocolIdRegistered
): void {
  let protocol = ProtocolIdData.load(event.params.protocolId.toString())

  if (protocol == null) {
    protocol = new ProtocolIdData(event.params.protocolId.toString())
    protocol.name = event.params.name
  } else {
    protocol.name = event.params.name
  }
  protocol.save()
}
