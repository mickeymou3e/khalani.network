import { formatFullTokenSymbol, formatTokenSymbol } from './tokens'

describe('formatTokenSymbol function', () => {
  it('should return token symbol name without network suffix', () => {
    const tokenSymbol = 'USDT.Avax'

    const expectedValue = 'USDT'

    expect(formatTokenSymbol(tokenSymbol)).toBe(expectedValue)
  })
})

describe('formatFullTokenSymbol function', () => {
  it('should return string of combined tokens symbol', () => {
    const tokenSymbols = ['USDT.Avax', 'KAI']

    const expectedValue = 'USDT - KAI'

    expect(formatFullTokenSymbol(tokenSymbols)).toBe(expectedValue)
  })
  it('should return string with token symbol', () => {
    const tokenSymbols = ['USDT.Avax']

    const expectedValue = 'USDT'

    expect(formatFullTokenSymbol(tokenSymbols)).toBe(expectedValue)
  })
})
