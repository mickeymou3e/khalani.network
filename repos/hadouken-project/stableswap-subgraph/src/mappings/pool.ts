import { Address, log } from '@graphprotocol/graph-ts'
import { updateUsedBlock } from '../utils/block'
import {
  NewFee,
  RampA,
  AddLiquidity,
  RemoveLiquidity,
  RemoveLiquidityImbalance,
  RemoveLiquidityOne,
  StopRampA
} from '../../generated/Registry/SwapTemplateBase'
import * as Schemas from '../../generated/schema'
import { removeLiquidityOne, addLiquidity, removeLiquidity } from './balances'

export function addLiquidityHandler(event: AddLiquidity): void {
  let pool = Schemas.Pool.load(event.address.toHexString())

  let totalSupply = event.params.token_supply
  let tokenAmounts = event.params.token_amounts

  log.info('[Pool] Liquidity Added {}', [totalSupply.toString()])

  if (pool) {
    pool.totalSupply = totalSupply
    pool.save()
  }

  addLiquidity(event.address, tokenAmounts)
  updateUsedBlock(event.block.number, event.block.hash)
}

export function removeLiquidityHandler(event: RemoveLiquidity): void {
  let pool = Schemas.Pool.load(event.address.toHexString())

  let totalSupply = event.params.token_supply
  let tokenAmounts = event.params.token_amounts
  for (let i = 0; i < tokenAmounts.length; ++i) {
    log.info('[Pool] Liquidity Removed {}', [tokenAmounts[i].toString()])
  }

  if (pool) {
    pool.totalSupply = totalSupply
    pool.save()
  }

  removeLiquidity(event.address, event.params.token_amounts)
  updateUsedBlock(event.block.number, event.block.hash)
}

export function removeLiquidityOneHandler(event: RemoveLiquidityOne): void {
  let pool = Schemas.Pool.load(event.address.toHexString())

  let totalSupply = event.params.token_supply
  if (pool) {
    pool.totalSupply = totalSupply
    pool.save()
  }

  removeLiquidityOne(event.address)
  updateUsedBlock(event.block.number, event.block.hash)
}

export function removeLiquidityImbalanceHandler(event: RemoveLiquidityImbalance): void {
  let pool = Schemas.Pool.load(event.address.toHexString())

  let totalSupply = event.params.token_supply
  let tokenAmounts = event.params.token_amounts

  log.info('[Pool] Liquidity Added {}', [totalSupply.toString()])
  for (let i = 0; i < tokenAmounts.length; ++i) {
    log.info('[Pool] Liquidity Removed Imbalance {}', [tokenAmounts[i].toString()])
  }

  if (pool) {
    pool.totalSupply = totalSupply
    pool.save()
  }
  removeLiquidityOne(event.address)
  updateUsedBlock(event.block.number, event.block.hash)
}

export function newFeeHandler(event: NewFee): void {
  let pool = Schemas.Pool.load(event.address.toHexString())
  if (pool) {
    pool.adminFee = event.params.admin_fee
    pool.fee = event.params.fee
    pool.save()
  }
  updateUsedBlock(event.block.number, event.block.hash)
}

// RampA Event indicate process of changing RampA, not instant RampA change
export function rampAHandler(event: RampA): void {
  let pool = Schemas.Pool.load(event.address.toHexString())

  if (pool) {
    pool.rampA = event.params.new_A
    pool.save()
  }
  updateUsedBlock(event.block.number, event.block.hash)
}

export function stopRampAHandler(event: StopRampA): void {
  let pool = Schemas.Pool.load(event.address.toHexString())

  if (pool) {
    pool.rampA = event.params.A
    pool.save()
  }
  updateUsedBlock(event.block.number, event.block.hash)
}
