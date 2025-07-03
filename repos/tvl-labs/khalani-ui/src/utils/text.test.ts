import { formatPercentValue, formatTokenAmount, formatWithCommas } from './text'

describe('formatTokenAmount function', () => {
  describe('token is not WBTC', () => {
    const decimals = 6

    it('should return amount with four decimals', () => {
      const amount = '146.32132154'

      const expectedValue = '146.3213'

      expect(formatTokenAmount(amount)).toBe(expectedValue)
    })

    it('should add .0000 to amount if is integer', () => {
      const amount = '100'

      const expectedValue = '100.0000'

      expect(formatTokenAmount(amount)).toBe(expectedValue)
    })

    it('should return < 0.0001 if amount is less than 0.0001', () => {
      const amount = '0.0000032'

      const expectedValue = '< 0.0001'

      expect(formatTokenAmount(amount)).toBe(expectedValue)
    })

    it('should return rounded value', () => {
      const amount = '0.00019'

      const expectedValue = '0.0002'

      expect(formatTokenAmount(amount)).toBe(expectedValue)
    })

    it('should not round if value has exact four decimals', () => {
      const amount = '10.2343'

      expect(formatTokenAmount(amount)).toBe(amount)
    })

    it('should return correct value if amount is bigint', () => {
      const amount = BigInt(4562512)

      const expectedValue = '4.5625'

      expect(formatTokenAmount(amount, decimals)).toBe(expectedValue)
    })
  })
})

describe('formatWithCommas function', () => {
  it('should return amount with commas as thousands separators and fixed to two decimals', () => {
    const amount = BigInt('2164235422')
    const decimals = 6

    const expectedValue = '2,164.24'

    expect(formatWithCommas(amount, decimals)).toBe(expectedValue)
  })
})

describe('formatPercentValue function', () => {
  it('should return amount with commas as thousands separators and fixed to two decimals', () => {
    const amount = BigInt(2) * BigInt(10) ** BigInt(18)
    const decimals = 18

    const expectedValue = '2'

    expect(formatPercentValue(amount, decimals)).toBe(expectedValue)
  })
})
