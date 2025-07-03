import { BigNumber, BigNumberish } from 'ethers'

import { calculatePriceImpactWithdraw as calculateWeightedPoolWithdrawPriceImpact } from '@hadouken-project/sdk'

import { getSDKByChainId } from '../../services/sor/sor.service'
import { PriceImpactDepositInput } from './types'

export class BigDecimal {
  public stringValue: string
  constructor(readonly value: BigNumber, readonly decimals: number) {
    this.stringValue = this.toString()
  }

  static from(number: BigNumberish, decimals = 18): BigDecimal {
    return new BigDecimal(BigNumber.from(number), decimals)
  }

  static fromString(decimalString: string, decimals = 18): BigDecimal {
    const [wholePartString, fractionPartString] = decimalString.split('.')

    const fractionPartLength = fractionPartString?.length ?? 0

    let bigNumberString
    if (decimals > fractionPartLength) {
      const additionalZeros = '0'.repeat(decimals - fractionPartLength)
      bigNumberString =
        [wholePartString, fractionPartString].join('') + additionalZeros
    } else {
      bigNumberString = [
        wholePartString,
        fractionPartString.slice(0, decimals),
      ].join('')
    }

    const value = BigNumber.from(bigNumberString)
    return new BigDecimal(value, decimals)
  }

  public add(bigDecimal: BigDecimal): BigDecimal {
    const resultDecimals = Math.max(this.decimals, bigDecimal.decimals)
    const resultDecimalsDenominator = Math.min(
      this.decimals,
      bigDecimal.decimals,
    )

    const value1 = this.value.mul(BigNumber.from(10).pow(bigDecimal.decimals))
    const value2 = bigDecimal.value.mul(BigNumber.from(10).pow(this.decimals))
    const resultValue = value1
      .add(value2)
      .div(BigNumber.from(10).pow(resultDecimalsDenominator))

    return new BigDecimal(resultValue, resultDecimals)
  }

  sub(bigDecimal: BigDecimal): BigDecimal {
    const resultDecimals = Math.max(this.decimals, bigDecimal.decimals)
    const resultDecimalsDenominator = Math.min(
      this.decimals,
      bigDecimal.decimals,
    )
    const value1 = this.value.mul(BigNumber.from(10).pow(bigDecimal.decimals))
    const value2 = bigDecimal.value.mul(BigNumber.from(10).pow(this.decimals))

    const resultValue = value1
      .sub(value2)
      .div(BigNumber.from(10).pow(resultDecimalsDenominator))

    return new BigDecimal(resultValue, resultDecimals)
  }

  public mul(bigDecimal: BigDecimal): BigDecimal {
    const resultDecimals = Math.max(this.decimals, bigDecimal.decimals)
    const resultDecimalsDenominator = Math.min(
      this.decimals,
      bigDecimal.decimals,
    )

    const value = this.value
      .mul(bigDecimal.value)
      .div(BigNumber.from(10).pow(resultDecimalsDenominator))

    return new BigDecimal(value, resultDecimals)
  }

  public div(bigDecimal: BigDecimal, decimals?: number): BigDecimal {
    const divisionAccuracy = 27

    const divisionResultBN = bigDecimal.value.eq(0)
      ? BigNumber.from(0)
      : this.value

          .mul(
            BigNumber.from(10).pow(
              Math.abs(divisionAccuracy - this.decimals + bigDecimal.decimals),
            ),
          )
          .div(bigDecimal.value)

    if (decimals && decimals > 0) {
      return new BigDecimal(
        divisionResultBN
          .mul(BigNumber.from(10).pow(decimals))
          .div(BigNumber.from(10).pow(divisionAccuracy)),
        decimals,
      )
    }

    return new BigDecimal(divisionResultBN, divisionAccuracy)
  }

  public gt(bigDecimal: BigDecimal): boolean {
    const value1 = this.value.mul(BigNumber.from(10).pow(bigDecimal.decimals))
    const value2 = bigDecimal.value.mul(BigNumber.from(10).pow(this.decimals))

    return value1.gt(value2)
  }

  public gte(bigDecimal: BigDecimal): boolean {
    const value1 = this.value.mul(BigNumber.from(10).pow(bigDecimal.decimals))
    const value2 = bigDecimal.value.mul(BigNumber.from(10).pow(this.decimals))

    return value1.gte(value2)
  }

  public lt(bigDecimal: BigDecimal): boolean {
    const value1 = this.value.mul(BigNumber.from(10).pow(bigDecimal.decimals))
    const value2 = bigDecimal.value.mul(BigNumber.from(10).pow(this.decimals))

    return value1.lt(value2)
  }

  public toString(): string {
    if (this.value.eq(0)) {
      return '0'
    }

    const digits = this.value.toString()

    if (digits.length > this.decimals) {
      const wholePart = digits.slice(0, digits.length - this.decimals)
      const fractionPart = digits
        .slice(digits.length - this.decimals)
        .replace(/0+$/, '')
      return fractionPart ? [wholePart, fractionPart].join('.') : wholePart
    } else {
      const additionalZeros = this.decimals - digits.length
      const decimal = `0.${'0'.repeat(additionalZeros)}` + digits
      const decimalWithRemovedZerosAtTheEnd = decimal.replace(/0+$/, '')

      return decimalWithRemovedZerosAtTheEnd
    }
  }

  public toFixed(fractionDigits?: number): string {
    if (!fractionDigits) {
      return this.toString()
    }

    if (this.value.eq(0)) {
      return `0.${'0'.repeat(fractionDigits)}`
    }

    const digits = this.value.toString()

    let wholePart
    let fractionPart

    if (digits.length > this.decimals) {
      wholePart = digits.slice(0, digits.length - this.decimals)
      fractionPart = digits.slice(digits.length - this.decimals)

      if (fractionPart.length > fractionDigits) {
        return [wholePart, fractionPart.slice(0, fractionDigits)].join('.')
      } else {
        return (
          [wholePart, fractionPart].join('.') +
          '0'.repeat(fractionDigits - fractionPart.length)
        )
      }
    } else {
      const fractionPartLeadingZeros = this.decimals - digits.length
      wholePart = '0'
      fractionPart = '0'.repeat(fractionPartLeadingZeros) + digits
    }

    if (fractionPart.length > fractionDigits) {
      return [wholePart, fractionPart.slice(0, fractionDigits)].join('.')
    } else {
      return (
        [wholePart, fractionPart].join('.') +
        '0'.repeat(fractionDigits - fractionPart.length)
      )
    }
  }

  public toBigNumber(): BigNumber {
    return this.value
  }

  public toNumber(): number {
    const stringValue = this.toString()

    return Number(stringValue)
  }
}

export const calculatePriceImpactDeposit = async ({
  depositAmounts,
  poolId,
  chainId,
  userAddress,
}: PriceImpactDepositInput): Promise<string> => {
  try {
    const amountsInString = depositAmounts.map((amount) =>
      amount.value.value.toString(),
    )
    const tokensAddresses = depositAmounts.map((token) => token.tokenAddress)
    const precision = 6

    const pool = await getSDKByChainId(chainId).pools.find(poolId)

    if (
      !userAddress ||
      !pool ||
      depositAmounts.every((deposit) => deposit.value.value.isZero())
    )
      return '0.00%'

    const { minBPTOut } = pool.buildJoin(
      userAddress,
      tokensAddresses,
      amountsInString,
      '0',
    )
    const priceImpact = await pool?.calcPriceImpact(
      amountsInString,
      minBPTOut,
      true,
    )
    const result =
      BigNumber.from(priceImpact)
        .div(BigNumber.from(10).pow(16 - precision))
        .toNumber() / Math.pow(10, precision)

    return `${
      Math.abs(result).toFixed(2) === '0.00'
        ? '< 0.01'
        : Math.abs(result).toFixed(2)
    }%`
  } catch (e) {
    console.error(e)
  }

  return '0.00'
}

export const calculatePriceImpactWithdraw = async (
  isProportional: boolean,
  withdrawAmounts: BigDecimal[],
  poolBalances: BigDecimal[],
  weights: BigDecimal[],
  swapFee: BigDecimal,
  totalLiquidity: BigDecimal,
): Promise<string> => {
  const priceImpact = await calculateWeightedPoolWithdrawPriceImpact(
    isProportional,
    withdrawAmounts.map((amount) => amount.toBigNumber()),
    withdrawAmounts.map((amount) => amount.decimals),
    poolBalances.map((balance) => balance.toBigNumber()),
    weights.map((weight) => weight.toBigNumber()),
    swapFee.toBigNumber(),
    totalLiquidity.toBigNumber(),
  )

  if (priceImpact.eq(0)) {
    return '0.00%'
  }

  const parsedPriceImpact = BigDecimal.from(priceImpact, 18).toNumber()

  return `${
    Math.abs(parsedPriceImpact).toFixed(2) === '0.00'
      ? '< 0.01'
      : Math.abs(parsedPriceImpact).toFixed(2)
  }%`
}

export const calculatePriceImpactSwap = (
  effectivePrice?: string | null,
  spotPrice?: string | null,
): number => {
  if (!effectivePrice || !spotPrice) return 0
  const priceImpactPercentage = Math.abs(
    (1 - Number(effectivePrice) / Number(spotPrice)) * 100,
  )

  return priceImpactPercentage
}

export function toChainedReference(key: number): BigNumber {
  const CHAINED_REFERENCE_PREFIX = 'ba10'

  // The full padded prefix is 66 characters long, with 64 hex characters and the 0x prefix.
  const paddedPrefix = `0x${CHAINED_REFERENCE_PREFIX}${'0'.repeat(
    64 - CHAINED_REFERENCE_PREFIX.length,
  )}`

  return BigNumber.from(paddedPrefix).add(key)
}

export const SLIPPAGE_DECIMALS = 4
export const ONE_PERCENT = BigNumber.from(10000)
export const ONE_AND_HALF_PERCENT = BigNumber.from(15000)
export const HUNDRED_PERCENTAGE = BigNumber.from(1000000)

export const removeSlippageFromValue = (
  value: BigNumber,
  slippage: BigNumber,
): BigNumber => {
  return value.sub(value.mul(slippage).div(HUNDRED_PERCENTAGE))
}
