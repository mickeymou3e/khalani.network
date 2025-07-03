import { IRow } from '@tvl-labs/khalani-ui'

export interface LiquidityListContainerProps {
  rowClickFn: (id: string) => void
  addBalanceFn: () => void
  mTokenBalancesRows: { isIntentBalance: boolean }[] | IRow[]
  isMTokenBalancesInitialized: boolean
  isNoBalanceView: boolean
}
