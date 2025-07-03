import { FillStructure, OutcomeAssetStructure } from '@interfaces/outcome'
import { UIIntentParams } from '@store/swaps'
import { buildOutcome } from './outcome.service'

describe('buildOutcome', () => {
  it('should calculate outcome with exact amount when no slippage or fee is given', () => {
    const params: UIIntentParams = {
      srcToken: '0xTokenAddress1',
      srcAmount: BigInt(1000),
      destTokens: ['0xTokenAddress1'],
    }
    const mTokens = ['0xMTokenAddress1']

    const outcome = buildOutcome(params, mTokens)

    expect(outcome.fillStructure).toBe(FillStructure.Exact)
    expect(outcome.mAmounts).toEqual([BigInt(1000)])
    expect(outcome.outcomeAssetStructure).toBe(OutcomeAssetStructure.AnySingle)
  })

  it('should calculate outcome with minimum amount when slippage is given', () => {
    const params: UIIntentParams = {
      srcToken: '0xTokenAddress1',
      srcAmount: BigInt(1000),
      destTokens: ['0xTokenAddress1'],
      slippage: 0.01,
    }
    const mTokens = ['0xMTokenAddress1']

    const outcome = buildOutcome(params, mTokens)

    expect(outcome.fillStructure).toBe(FillStructure.Minimum)
    expect(outcome.mAmounts).toEqual([BigInt(990)]) // 1% slippage
    expect(outcome.outcomeAssetStructure).toBe(OutcomeAssetStructure.AnySingle)
  })

  it('should calculate outcome with percentage fill when feePercentage is given', () => {
    const params: UIIntentParams = {
      srcToken: '0xTokenAddress1',
      srcAmount: BigInt(1000),
      destTokens: ['0xTokenAddress1'],
      feePercentage: 0.02,
    }
    const mTokens = ['0xMTokenAddress1']

    const outcome = buildOutcome(params, mTokens)

    expect(outcome.fillStructure).toBe(FillStructure.PercentageFilled)
    expect(outcome.mAmounts).toEqual([BigInt(20) * BigInt(10) ** BigInt(18)]) // 2% fee
    expect(outcome.outcomeAssetStructure).toBe(OutcomeAssetStructure.AnySingle)
  })

  it('should handle multiple mTokens correctly with no slippage or fee', () => {
    const params: UIIntentParams = {
      srcToken: '0xTokenAddress1',
      srcAmount: BigInt(1000),
      destTokens: ['0xTokenAddress1', '0xTokenAddress2'],
    }
    const mTokens = ['0xMTokenAddress1', '0xMTokenAddress2']

    const outcome = buildOutcome(params, mTokens)

    expect(outcome.fillStructure).toBe(FillStructure.Exact)
    expect(outcome.mAmounts).toEqual([BigInt(1000)])
    expect(outcome.outcomeAssetStructure).toBe(OutcomeAssetStructure.AnySingle)
  })

  it('should handle multiple mTokens correctly with slippage', () => {
    const params: UIIntentParams = {
      srcToken: '0xTokenAddress1',
      srcAmount: BigInt(1000),
      destTokens: ['0xTokenAddress1', '0xTokenAddress2'],
      slippage: 0.05,
    }
    const mTokens = ['0xMTokenAddress1', '0xMTokenAddress2']

    const outcome = buildOutcome(params, mTokens)

    expect(outcome.fillStructure).toBe(FillStructure.Minimum)
    expect(outcome.mAmounts).toEqual([BigInt(950)]) // 5% slippage
    expect(outcome.outcomeAssetStructure).toBe(OutcomeAssetStructure.AnySingle)
  })

  it('should handle multiple mTokens correctly with feePercentage', () => {
    const params: UIIntentParams = {
      srcToken: '0xTokenAddress1',
      srcAmount: BigInt(1000),
      destTokens: ['0xTokenAddress1', '0xTokenAddress2'],
      feePercentage: 0.03,
    }
    const mTokens = ['0xMTokenAddress1', '0xMTokenAddress2']

    const outcome = buildOutcome(params, mTokens)

    expect(outcome.fillStructure).toBe(FillStructure.PercentageFilled)
    expect(outcome.mAmounts).toEqual([
      BigInt(30) * BigInt(10) ** BigInt(18),
      BigInt(30) * BigInt(10) ** BigInt(18),
    ]) // 3% fee for each token
    expect(outcome.outcomeAssetStructure).toBe(OutcomeAssetStructure.AnySingle)
  })
})
