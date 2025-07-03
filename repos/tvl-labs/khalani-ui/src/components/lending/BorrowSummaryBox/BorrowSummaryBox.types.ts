export interface IBorrowSummaryBoxProps {
  loan: bigint | undefined
  newLoan: bigint | undefined
  totalDebt: bigint | undefined
  newTotalDebt: bigint | undefined
  liquidationPrice: bigint | undefined
  newLiquidationPrice: bigint | undefined
  fee: bigint | undefined
  decimals: number
}
