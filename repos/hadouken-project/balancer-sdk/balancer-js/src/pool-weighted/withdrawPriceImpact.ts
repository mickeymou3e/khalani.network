import * as SDK from '@georgeroman/balancer-v2-pools';
import OldBigNumber from 'bignumber.js';
// eslint-disable-next-line no-restricted-imports
import { BigNumber } from 'ethers';
import { weightedBPTForTokensZeroPriceImpact as _bptForTokensZeroPriceImpact } from '..';

const ZERO = BigNumber.from(0);
const ONE_18_DIGITS = BigNumber.from(10).pow(18);

export const calculatePriceImpactWithdraw = async (
  isProportional: boolean,
  withdrawAmounts: BigNumber[],
  decimals: number[],
  poolBalances: BigNumber[],
  weights: BigNumber[],
  swapFee: BigNumber,
  totalLiquidity: BigNumber
): Promise<BigNumber> => {
  if (
    isProportional ||
    withdrawAmounts.every((amount) => amount.lte(BigNumber.from(0)))
  )
    return ZERO;

  if (withdrawAmounts.some((amount, index) => amount.gt(poolBalances[index]))) {
    return ZERO;
  }

  const poolBalancesOldBigNumber = poolBalances.map(
    (balance) => new OldBigNumber(balance.toString())
  );
  const weightsOldBigNumber = weights.map(
    (weight) => new OldBigNumber(weight.toString())
  );

  const withdrawAmountsOldBigNumber = withdrawAmounts.map(
    (amount) => new OldBigNumber(amount.toString())
  );

  const bptAmountOldBigNumber = SDK.WeightedMath._calcBptInGivenExactTokensOut(
    poolBalancesOldBigNumber,
    weightsOldBigNumber,
    withdrawAmountsOldBigNumber,
    new OldBigNumber(totalLiquidity.toString()),
    new OldBigNumber(swapFee.toString())
  );

  const bptAmount = BigNumber.from(bptAmountOldBigNumber.toString());

  const bptZeroPriceImpact = _bptForTokensZeroPriceImpact(
    poolBalances,
    decimals,
    weights,
    withdrawAmounts,
    totalLiquidity
  );

  const priceImpact = bptAmount
    .mul(ONE_18_DIGITS)
    .div(bptZeroPriceImpact)
    .sub(ONE_18_DIGITS);

  const priceImpactRecalculated = priceImpact.mul(BigNumber.from(100));

  return priceImpactRecalculated;
};
