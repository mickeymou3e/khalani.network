import { findMToken, formatTokenSymbol } from './token'

describe('formatTokenSymbol function', () => {
  it('should return token symbol name without network suffix', () => {
    const tokenSymbol = 'USDT.fuji'

    const expectedValue = 'USDT'

    expect(formatTokenSymbol(tokenSymbol)).toBe(expectedValue)
  })

  it('should return token symbol name without `kln` preffix', () => {
    const tokenSymbol = 'klnUSDT'

    const expectedValue = 'USDT'

    expect(formatTokenSymbol(tokenSymbol)).toBe(expectedValue)
  })

  it('should return token symbol name without `stk` preffix', () => {
    const tokenSymbol = 'stkUSDT'

    const expectedValue = 'USDT'

    expect(formatTokenSymbol(tokenSymbol)).toBe(expectedValue)
  })

  it('should return corresponding mToken', () => {
    const expectedValue = {
      id: '0x41786f6e:0xeE37F7f98d003C2474310EC27529297bBEAd61Ef',
      address: '0xeE37F7f98d003C2474310EC27529297bBEAd61Ef',
      decimals: 18,
      name: 'USDC | fuji',
      symbol: 'USDC.fuji',
      chainId: '0x41786f6e',
      sourceChainId: '0xa869',
    }

    expect(findMToken('USDC.fuji', '0xa869')).toEqual(expectedValue)
  })
})
