export const SLIPPAGE_DECIMALS = 4

export const defaultValues = [
  {
    id: 1,
    label: '0.2%',
    value: BigInt(2) * BigInt(10) ** BigInt(4),
  },
  {
    id: 2,
    label: '0.5%',
    value: BigInt(5) * BigInt(10) ** BigInt(4),
  },
  {
    id: 3,
    label: '1.0%',
    value: BigInt(10) * BigInt(10) ** BigInt(4),
  },
]
