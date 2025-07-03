import { ethereum } from '@graphprotocol/graph-ts'
import { updateBlock, updateUsedBlock } from '../utils/block'

export function handleBlock(block: ethereum.Block): void {
  let blockNumber = block.number
  let blockHash = block.hash

  updateBlock(blockNumber, blockHash)
}

export function handleUsedBlock(block: ethereum.Block): void {
  let blockNumber = block.number
  let blockHash = block.hash

  updateUsedBlock(blockNumber, blockHash)
}
