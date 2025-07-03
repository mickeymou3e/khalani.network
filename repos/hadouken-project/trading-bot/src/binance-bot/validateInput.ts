import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsString,
  validateOrReject,
} from 'class-validator'
import { pools as hadoukenPools } from '@config/hadouken.json'
import { pools as binancePairs } from '@config/binance.json'
import { GODWOKEN_MAINNET_CHAIN_ID } from '../liquidation-fetcher/liquidation-fetcher.constants'

const supportedNetworks = [GODWOKEN_MAINNET_CHAIN_ID]

const hadoukenPoolNames = hadoukenPools.map((pair) => pair.name)
const binancePoolNames = binancePairs.map((pair) => pair.name)

const knownPoolNames = [...hadoukenPoolNames, ...binancePoolNames]

class InputType {
  @IsString()
  @IsNotEmpty()
  @IsIn(knownPoolNames)
  poolNameForBuy: string

  @IsString()
  @IsNotEmpty()
  @IsIn(knownPoolNames)
  poolNameForSell: string

  @IsString()
  @IsNotEmpty()
  baseTokenSymbol: string

  @IsString()
  @IsNotEmpty()
  quoteTokenSymbol: string

  @IsNumberString()
  @IsNotEmpty()
  quoteTokenThreshold: string

  @IsNumberString()
  @IsNotEmpty()
  minProfit: string

  @IsString()
  @IsNotEmpty()
  @IsIn(supportedNetworks)
  chainId: string
}

const eventToValidate = new InputType()

export async function validateInput(event: InputType) {
  eventToValidate.poolNameForBuy = event.poolNameForBuy
  eventToValidate.poolNameForSell = event.poolNameForSell
  eventToValidate.baseTokenSymbol = event.baseTokenSymbol
  eventToValidate.quoteTokenSymbol = event.quoteTokenSymbol
  eventToValidate.quoteTokenThreshold = event.quoteTokenThreshold
  eventToValidate.minProfit = event.minProfit
  eventToValidate.chainId = event.chainId

  try {
    await validateOrReject(eventToValidate)

    return {
      ...event,
      findOpportunityResult: { subgraphBlocksBehind: 0 },
    }
  } catch (error) {
    throw new Error(error)
  }
}
