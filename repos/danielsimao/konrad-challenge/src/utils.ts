import Big from 'big.js';

const toAtomicAmount = (amount: number | string, decimals: number) => {
  const decimalScale = 10 ** decimals;
  const atomicAmount = new Big(amount).mul(decimalScale).round(0, Big.roundDown);
  return BigInt(atomicAmount.toFixed());
};

const toHumanAmount = (atomicAmount: bigint, decimals: number) => {
  const decimalScale = 10n ** BigInt(decimals);
  const humanAmount = new Big(Number(atomicAmount)).div(Number(decimalScale));

  return humanAmount.toFixed();
};

export { toAtomicAmount, toHumanAmount };
