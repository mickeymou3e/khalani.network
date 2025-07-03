import { IRow } from '@tvl-labs/khalani-ui'

export interface LiquidityListContainerProps {
  rowClickFn: (id: string) => void
  addBalanceFn: () => void
  intentBalancesRows: { isIntentBalance: boolean }[] | IRow[]
  isIntentBalancesInitialized: boolean
  isNoBalanceView: boolean
}
