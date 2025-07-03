import { BigNumber } from 'ethers'

import {
  convertNumberToStringWithCommas,
  formatMaxAvailableAmount,
  formatTokenAmount,
} from './text'

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

    it('should return correct value if amount is BigNumber', () => {
      const amount = BigNumber.from(4562512)

      const expectedValue = '4.5625'

      expect(formatTokenAmount(amount, decimals)).toBe(expectedValue)
    })
  })
})

describe('convertNumberToStringWithCommas function', () => {
  it('should return correct value if value is a decimal number', () => {
    const value = 1200.231432
    const expectedValue = '1,200.23'

    expect(convertNumberToStringWithCommas(value)).toBe(expectedValue)
  })

  it('should return correct value if value is an integer', () => {
    const value = 1203
    const expectedValue = '1,203.00'

    expect(convertNumberToStringWithCommas(value)).toBe(expectedValue)
  })

  it('should return correct number with commas if the value is really high number', () => {
    const value = 9832139123123
    const expectedValue = '9,832,139,123,123.00'

    expect(convertNumberToStringWithCommas(value)).toBe(expectedValue)
  })

  it('should return correct decimal places if passed as a prop', () => {
    const value = 3211203.93821
    const expectedValue = '3,211,203.9382'

    expect(convertNumberToStringWithCommas(value, 4)).toBe(expectedValue)
  })

  it('should return number without decimals if decimals are equal to zero', () => {
    const value = 1234.0
    const expectedValue = '1,234'

    expect(convertNumberToStringWithCommas(value, undefined, true)).toBe(
      expectedValue,
    )
  })

  it('should return one zero if value is equal to 0, even with decimals', () => {
    const value = 0.0
    const expectedValue = '0'

    expect(convertNumberToStringWithCommas(value, undefined, true)).toBe(
      expectedValue,
    )
  })
})
describe('formatMaxAvailableAmount', () => {
  it('should return loading text when isFetching is true', () => {
    expect(
      formatMaxAvailableAmount(
        BigNumber.from('100000000000000000000'),
        18,
        true,
      ),
    ).toBe('Loading...')
  })

  it('should return loading text when decimals are undefined', () => {
    expect(
      formatMaxAvailableAmount(
        BigNumber.from('100000000000000000000'),
        undefined,
        false,
      ),
    ).toBe('Loading...')
  })

  it('should return correct maxAmount with 2 decimals', () => {
    expect(
      formatMaxAvailableAmount(
        BigNumber.from('100000000000000000000'),
        18,
        false,
      ),
    ).toBe('100.00')
  })

  it('should return < 0.01 when maxAmount is less than 0.01', () => {
    expect(
      formatMaxAvailableAmount(BigNumber.from('1000000000000000'), 18, false),
    ).toBe('< 0.01')
  })

  it('should return 0', () => {
    expect(formatMaxAvailableAmount(BigNumber.from('0'), 18, false)).toBe(
      '0.00',
    )
  })

  it('should return 0.01', () => {
    expect(
      formatMaxAvailableAmount(BigNumber.from('10000000000000000'), 18, false),
    ).toBe('0.01')
  })
})
