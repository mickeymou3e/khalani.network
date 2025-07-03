import {
  convertDecimalToIntegerDecimal,
  convertIntegerDecimalToDecimal,
  formatAccountAddress,
  getInputValue,
  truncateDecimals,
} from './index'

describe('Utils', () => {
  it('truncateDecimals', () => {
    expect(truncateDecimals('123')).toEqual('123')
    expect(truncateDecimals('123.1')).toEqual('123.10')
    expect(truncateDecimals('123.23')).toEqual('123.23')
    expect(truncateDecimals('123.123')).toEqual('123.12')

    expect(truncateDecimals('0.23')).toEqual('0.23')
    expect(truncateDecimals('0.234')).toEqual('0.23')

    expect(truncateDecimals('.23')).toEqual('.23')
    expect(truncateDecimals('.234')).toEqual('.23')

    expect(truncateDecimals('123.234', 3)).toEqual('123.234')
    expect(truncateDecimals('123.2345', 3)).toEqual('123.234')

    expect(truncateDecimals('123.2', 1)).toEqual('123.2')
    expect(truncateDecimals('123.2345', 1)).toEqual('123.2')

    expect(truncateDecimals('0.', 2)).toEqual('0.00')
  })

  it('convertIntegerDecimalToDecimal', () => {
    expect(convertIntegerDecimalToDecimal(BigInt(1), 2)).toEqual('0.01')
    expect(convertIntegerDecimalToDecimal(BigInt(0), 2)).toEqual('0.00')
    expect(convertIntegerDecimalToDecimal(BigInt(0), 4)).toEqual('0.0000')
    expect(convertIntegerDecimalToDecimal(BigInt(12345678), 2)).toEqual(
      '123456.78',
    )
    expect(convertIntegerDecimalToDecimal(BigInt(1234), 2)).toEqual('12.34')
    expect(convertIntegerDecimalToDecimal(BigInt(1000), 2)).toEqual('10.00')
    expect(convertIntegerDecimalToDecimal(BigInt(1000), 3)).toEqual('1.000')
    expect(convertIntegerDecimalToDecimal(BigInt(10000), 2)).toEqual('100.00')

    expect(convertIntegerDecimalToDecimal(BigInt(100), 4)).toEqual('0.01')
    expect(convertIntegerDecimalToDecimal(BigInt(1000), 4)).toEqual('0.1')
    expect(convertIntegerDecimalToDecimal(BigInt(2002), 5)).toEqual('0.02002')
    expect(convertIntegerDecimalToDecimal(BigInt(9508), 4)).toEqual('0.9508')
  })

  it('convertDecimalToIntegerDecimal', () => {
    expect(convertDecimalToIntegerDecimal('10.00', 4)).toEqual(BigInt('100000'))

    expect(convertDecimalToIntegerDecimal('555', 4)).toEqual(BigInt('5550000'))

    expect(convertDecimalToIntegerDecimal('00000.23', 4)).toEqual(
      BigInt('2300'),
    )
    expect(convertDecimalToIntegerDecimal('0.00009', 4)).toEqual(BigInt('0'))
    expect(convertDecimalToIntegerDecimal('0.0009', 4)).toEqual(BigInt('9'))
  })

  it('getInputValue', () => {
    expect(getInputValue('1')).toEqual('1')
    expect(getInputValue('.')).toBeNull()
    expect(getInputValue('100.')).toBeNull()
    expect(getInputValue('0.123')).toBeNull()
    expect(getInputValue('0.123', 3)).toEqual('0.123')
    expect(getInputValue('0.1234', 3)).toBeNull()
    expect(getInputValue('')).toEqual('')
  })
  it('formatAccountAddress', () => {
    // Valid address cases
    expect(
      formatAccountAddress(
        '0x7ed866dceff41e39d1d091fb28a834cd2256df07cb41869d261bc41ff4ccaa41',
      ),
    ).toEqual('0x7ed8...aa41')

    expect(
      formatAccountAddress('0x1234567890abcdef1234567890abcdef12345678'),
    ).toEqual('0x1234...5678')

    expect(
      formatAccountAddress('0xabcdefabcdefabcdefabcdefabcdefabcdef'),
    ).toEqual('0xabcd...fdef')

    // Address with exactly 10 characters
    expect(formatAccountAddress('0x1234567890')).toEqual('0x1234...7890')

    // Invalid address cases
    expect(() =>
      formatAccountAddress(
        '7ed866dceff41e39d1d091fb28a834cd2256df07cb41869d261bc41ff4ccaa41',
      ),
    ).toThrow('Invalid Ethereum address')

    expect(() => formatAccountAddress('0x123')).toThrow(
      'Invalid Ethereum address',
    )
    expect(() => formatAccountAddress('123')).toThrow(
      'Invalid Ethereum address',
    )
  })
})
