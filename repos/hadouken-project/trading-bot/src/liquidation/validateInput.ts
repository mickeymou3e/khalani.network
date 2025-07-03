import { IsIn, IsNotEmpty, IsString, validateOrReject } from 'class-validator'
import {
  GODWOKEN_MAINNET_CHAIN_ID,
  GODWOKEN_TESTNET_CHAIN_ID,
  MANTLE_TESTNET_CHAIN_ID,
  ZKSYNC_TESTNET_CHAIN_ID,
} from '../liquidation-fetcher/liquidation-fetcher.constants'

const supportedNetworks = [
  GODWOKEN_MAINNET_CHAIN_ID,
  GODWOKEN_TESTNET_CHAIN_ID,
  ZKSYNC_TESTNET_CHAIN_ID,
  MANTLE_TESTNET_CHAIN_ID,
]

class ChainIdType {
  @IsString()
  @IsNotEmpty()
  @IsIn(supportedNetworks)
  chainId: string
}

const eventToValidate = new ChainIdType()

export async function validateInput(event: ChainIdType) {
  eventToValidate.chainId = event.chainId
  try {
    await validateOrReject(eventToValidate)
    return event
  } catch (error) {
    throw new Error('Invalid input object')
  }
}
