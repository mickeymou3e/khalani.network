import { ArbitragePair } from './lambdaTypes'
import { GODWOKEN_MAINNET_CHAIN_ID } from './liquidation-fetcher/liquidation-fetcher.constants'
import { validateInput } from './validate'

describe('Validation tests', () => {
  it('ValidateInput should pass the input', async () => {
    const arbitragePair: ArbitragePair = {
      poolNameForSell: 'yokaiUsdcWckb',
      poolNameForBuy: 'hadoukenUsdcCkb',
      baseToken: 'USDC',
      quoteToken: 'CKB',
      quoteTokenThreshold: '300000',
      minProfit: '36000000000000000000',
    }
    const chainId = GODWOKEN_MAINNET_CHAIN_ID
    const event = { arbitragePair, chainId }
    const result = await validateInput(event as any)

    expect(result).toEqual({
      ...event,
      calculatedTradeVolume: { subgraphBlocksBehind: 0 },
    })
  })

  it('ValidateInput should fail', async () => {
    const event = { arbitragePair: { wrongProperty: 'wrong' } }

    const validate = validateInput(event as any)

    await expect(validate).rejects.toThrowError('Invalid input object')
  })

  it('ValidateInput should fail when one property is missing', async () => {
    const event = {
      arbitragePair: {
        poolNameForSell: 'yokaiUsdcWckb',
        poolNameForBuy: 'hadoukenUsdcCkb',
        wrongName: 'USDC',
        quoteToken: 'CKB',
        quoteTokenThreshold: '300000',
        minProfit: '36000000000000000000',
      },
      chainId: GODWOKEN_MAINNET_CHAIN_ID,
    }
    const validate = validateInput(event as any)

    await expect(validate).rejects.toThrowError('Invalid input object')
  })

  it('ValidateInput should fail when a property has a wrong type', async () => {
    const event = {
      arbitragePair: {
        poolNameForSell: 'yokaiUsdcWckb',
        poolNameForBuy: 'hadoukenUsdcCkb',
        baseToken: 'USDC',
        quoteToken: 'CKB',
        quoteTokenThreshold: 300000,
        minProfit: '36000000000000000000',
      },
      chainId: GODWOKEN_MAINNET_CHAIN_ID,
    }
    const validate = validateInput(event as any)

    await expect(validate).rejects.toThrowError('Invalid input object')
  })

  it('ValidateInput should fail when a property is not one of the required', async () => {
    const event = {
      arbitragePair: {
        poolNameForSell: 'yokaiUsdcWckb',
        poolNameForBuy: 'hadoukenUsdcCkb',
        baseToken: 'PLN',
        quoteToken: 'CKB',
        quoteTokenThreshold: '300000',
        minProfit: '36000000000000000000',
      },
      chainId: GODWOKEN_MAINNET_CHAIN_ID,
    }
    const validate = validateInput(event as any)

    await expect(validate).rejects.toThrowError('Invalid input object')
  })
  it('ValidateInput should fail when one pool is not one of the required', async () => {
    const event = {
      arbitragePair: {
        poolNameForSell: 'uniswapUsdcWckb',
        poolNameForBuy: 'hadoukenUsdcCkb',
        baseToken: 'PLN',
        quoteToken: 'CKB',
        quoteTokenThreshold: '300000',
        minProfit: '36000000000000000000',
      },
      chainId: GODWOKEN_MAINNET_CHAIN_ID,
    }
    const validate = validateInput(event as any)

    await expect(validate).rejects.toThrowError('Invalid input object')
  })

  it('ValidateInput should fail when one property is empty', async () => {
    const event = {
      arbitragePair: {
        poolNameForSell: 'yokaiUsdcWckb',
        poolNameForBuy: 'hadoukenUsdcCkb',
        baseToken: 'PLN',
        quoteToken: 'CKB',
        quoteTokenThreshold: '',
        minProfit: '36000000000000000000',
      },
      chainId: GODWOKEN_MAINNET_CHAIN_ID,
    }
    const validate = validateInput(event as any)

    await expect(validate).rejects.toThrowError('Invalid input object')
  })

  it('ValidateInput should fail when all properties are empty', async () => {
    const event = {
      arbitragePair: {
        poolNameForSell: '',
        poolNameForBuy: '',
        baseToken: '',
        quoteToken: '',
        quoteTokenThreshold: '',
        minProfit: '',
        chainId: '',
      },
    }
    const validate = validateInput(event as any)

    await expect(validate).rejects.toThrowError('Invalid input object')
  })

  it('ValidateInput should fail when input is an empty object', async () => {
    const event = {}
    const validate = validateInput(event as any)

    await expect(validate).rejects.toThrowError('Invalid input object')
  })

  it('Validate should fail when input is an empty string', async () => {
    const event = ''
    const validate = validateInput(event as any)

    await expect(validate).rejects.toThrowError('Invalid input object')
  })
})
