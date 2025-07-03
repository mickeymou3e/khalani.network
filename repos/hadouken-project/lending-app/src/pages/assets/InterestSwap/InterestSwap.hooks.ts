import { useSelector } from 'react-redux'

import { BorrowType } from '@constants/Lending'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { usePushHistoryInternal } from '@utils/navigation'

export const useDebtTokenByInterestType = (
  tokenAddress?: string,
  interestType?: BorrowType,
): string | undefined => {
  const reserveById = useSelector(reservesSelectors.selectById)
  const reserve = reserveById(tokenAddress)
  const pushHistoryInternal = usePushHistoryInternal()

  if (interestType === BorrowType.variable)
    return reserve?.variableDebtTokenAddress
  else if (interestType === BorrowType.stable) {
    return reserve?.stableDebtTokenAddress
  } else {
    pushHistoryInternal('/dashboard')
  }
  return undefined
}
