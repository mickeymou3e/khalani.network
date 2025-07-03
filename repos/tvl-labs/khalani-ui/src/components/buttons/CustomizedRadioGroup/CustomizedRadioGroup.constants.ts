export const getOptions = (
  decimals: number,
): { id: string; name: string; value: bigint }[] => [
  {
    id: '1',
    name: '0.5',
    value: BigInt(5) * BigInt(10) ** BigInt(decimals - 1),
  },
  {
    id: '2',
    name: '1.0',
    value: BigInt(10) * BigInt(10) ** BigInt(decimals - 1),
  },
  {
    id: '3',
    name: '2.0',
    value: BigInt(20) * BigInt(10) ** BigInt(decimals - 1),
  },
]
