import { IsIn, IsNotEmpty, IsString, validateOrReject } from 'class-validator'
import { pools } from '@config/linearPools.json'
import {
  GODWOKEN_MAINNET_CHAIN_ID,
  GODWOKEN_TESTNET_CHAIN_ID,
  ZKSYNC_TESTNET_CHAIN_ID,
} from '../liquidation-fetcher/liquidation-fetcher.constants'

const supportedNetworks = [
  GODWOKEN_MAINNET_CHAIN_ID,
  GODWOKEN_TESTNET_CHAIN_ID,
  ZKSYNC_TESTNET_CHAIN_ID,
]
const knownPoolNames = pools.map((pool) => pool.name)

class PoolNamesType {
  @IsString()
  @IsNotEmpty()
  @IsIn(knownPoolNames)
  poolName: string

  @IsString()
  @IsNotEmpty()
  @IsIn(supportedNetworks)
  chainId: string
}

const eventToValidate = new PoolNamesType()

export async function validateInput(event: PoolNamesType) {
  eventToValidate.poolName = event.poolName

  try {
    await validateOrReject(eventToValidate)

    return event
  } catch (error) {
    throw new Error('Invalid input object')
  }
}
