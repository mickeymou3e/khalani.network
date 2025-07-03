import { TransactionHistoryProps } from '@components/TransactionHistory'
import { IModal } from '@interfaces/core'

import { IAccountOverviewProps } from './components/AccountOverview'
import { ITokenBalancesListProps } from './components/TokenBalancesList'

export interface IUserAddressesModal
  extends IModal,
    IAccountOverviewProps,
    ITokenBalancesListProps,
    TransactionHistoryProps {
  handleCreateNervosAccount?: () => void
}

export enum UserModalTabs {
  ASSETS,
  HISTORY,
}
