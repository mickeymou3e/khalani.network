export interface ILendingTokenBoxProps {
  tokenSymbol: string
  mintCap: bigint
  minDebt: bigint
  oneTimeFee: bigint
  collateral: bigint | undefined
  currentDebt: bigint | undefined
  ltv: bigint
  decimals: number
  onClick: (tokenSymbol: string) => void
}
