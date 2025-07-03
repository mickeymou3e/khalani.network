import { BigNumber } from 'ethers'

import * as utils from './PoolsContainer.utils'

describe('Utils', () => {
  describe('printOptional', () => {
    const formatter = (value: string) => value.split('').reverse().join('')

    it('should apply formatter', () => {
      const reversedValue = utils.formatOptional({
        value: 'abc',
        formatter,
      })
      expect(reversedValue).toEqual('cba')
    })

    it('should return default value', () => {
      const noValue = utils.formatOptional({
        value: undefined,
        formatter,
      })
      expect(noValue).toEqual('-')
    })
  })

  it('formatApy', () => {
    const apyBigNumber = BigNumber.from(10).pow(18)
    const formattedApy = utils.formatAPY(apyBigNumber)

    expect(formattedApy).toEqual('1.0000')
  })

  describe('formatVolume', () => {
    it('should format under 1', () => {
      const volumeBigNumber = BigNumber.from(1)
      const formattedVolume = utils.formatVolume(volumeBigNumber)

      expect(formattedVolume).toEqual('$1')
    })

    it('should format under 100k', () => {
      const bigNumber40k = BigNumber.from(10).pow(4).mul(4)
      const volumeBigNumber = bigNumber40k
      const formattedVolume = utils.formatVolume(volumeBigNumber)
      const priceValue = 40000
      expect(formattedVolume).toEqual(`$${priceValue.toLocaleString()}`)
    })

    it('should format 1m', () => {
      const volumeBigNumber = BigNumber.from(10).pow(6)
      const formattedVolume = utils.formatVolume(volumeBigNumber)

      expect(formattedVolume).toEqual('$1.0m')
    })

    it('should format 100k', () => {
      const bigNumber200k = BigNumber.from(10).pow(5).mul(2)
      const bigNumber40k = BigNumber.from(10).pow(4).mul(4)
      const volumeBigNumber = bigNumber200k.add(bigNumber40k)
      const formattedVolume = utils.formatVolume(volumeBigNumber)

      expect(formattedVolume).toEqual('$240.0k')
    })
  })
})
