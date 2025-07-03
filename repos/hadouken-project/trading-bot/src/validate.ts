import {
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumberString,
  IsObject,
  IsString,
  validateOrReject,
} from 'class-validator'
import { ValidateNested } from './helpers'
import { pairs } from '@config/arbitragePairs.json'
import { tokens } from '@config/tokens.json'
import { GODWOKEN_MAINNET_CHAIN_ID } from './liquidation-fetcher/liquidation-fetcher.constants'

const supportedNetworks = [GODWOKEN_MAINNET_CHAIN_ID]
const yokaiPoolNames = pairs.map((pair) => pair.yokaiPoolId)
const hadoukenPoolNames = pairs.map((pair) => pair.hadoukenPoolId)

const knownPoolNames = [...yokaiPoolNames, ...hadoukenPoolNames]

const knownTokens = tokens.map((token) => token.symbol)

class ArbitragePairType {
  @IsString()
  @IsNotEmpty()
  @IsIn(knownPoolNames)
  poolNameForSell: string

  @IsString()
  @IsNotEmpty()
  @IsIn(knownPoolNames)
  poolNameForBuy: string

  @IsString()
  @IsNotEmpty()
  @IsIn(knownTokens)
  baseToken: string

  @IsString()
  @IsNotEmpty()
  @IsIn(knownTokens)
  quoteToken: string

  @IsNumberString()
  @IsNotEmpty()
  quoteTokenThreshold: string

  @IsNumberString()
  @IsNotEmpty()
  minProfit: string
}

class InputType {
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested(ArbitragePairType)
  arbitragePair: ArbitragePairType

  @IsString()
  @IsNotEmpty()
  @IsIn(supportedNetworks)
  chainId: string
}

const eventToValidate = new InputType()

export async function validateInput(event: InputType) {
  eventToValidate.arbitragePair = event.arbitragePair
  eventToValidate.chainId = event.chainId

  try {
    await validateOrReject(eventToValidate)

    return { ...event, calculatedTradeVolume: { subgraphBlocksBehind: 0 } }
  } catch (error) {
    throw new Error('Invalid input object')
  }
}
