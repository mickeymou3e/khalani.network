import { BLOCK_ID } from '../constants'
import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import * as Schemas from '../../generated/schema'

export function updateBlock(number: BigInt, hash: Bytes): void {
  let block = createOrLoadBlock()
  block.number = number
  block.hash = hash
  block.save()
}

export function createOrLoadBlock(): Schemas.Block {
  let block = Schemas.Block.load(BLOCK_ID)

  if (!block) {
    block = new Schemas.Block(BLOCK_ID)
    block.number = BigInt.fromI32(0)
  }

  return block as Schemas.Block
}
export function updateUsedBlock(number: BigInt, hash: Bytes): void {
  let block = createOrLoadUsedBlock()
  block.number = number
  block.hash = hash
  block.save()
}

export function createOrLoadUsedBlock(): Schemas.UsedBlock {
  let block = Schemas.UsedBlock.load(BLOCK_ID)

  if (!block) {
    block = new Schemas.UsedBlock(BLOCK_ID)
    block.number = BigInt.fromI32(0)
  }

  return block as Schemas.UsedBlock
}
