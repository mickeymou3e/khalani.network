import { formatPoolName } from './pool'

describe('formatPoolName function', () => {
  it('should return formatted pool name', () => {
    const poolName = 'USDC.avax/KAI'

    const expectedValue = 'USDC - KAI'

    expect(formatPoolName(poolName)).toBe(expectedValue)
  })
})
