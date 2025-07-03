import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { REFRESH_TOOLTIPS_MS } from '@constants/Numbers'
import { balancesSelectors } from '@store/balances/balances.selector'
import { reservesSelectors } from '@store/reserves/reserves.selector'

export const useDepositTokenBalanceOverTime = (
  tokenAddress?: string,
): BigNumber => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_timeStamp, setTimeStamp] = useState(
    BigNumber.from(Date.now()).div(1000),
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStamp(BigNumber.from(Date.now()).div(1000))
    }, REFRESH_TOOLTIPS_MS)
    return () => clearInterval(timer)
  })

  const depositBalanceSelector = useSelector(
    balancesSelectors.selectUserDepositBalance,
  )
  const reserves = useSelector(reservesSelectors.selectById)

  if (!tokenAddress) return BigNumber.from(0)

  const withdrawAToken = reserves(tokenAddress)
  const aTokenAddress = withdrawAToken?.aTokenAddress

  if (!aTokenAddress) return BigNumber.from(0)

  const userATokenBalance =
    depositBalanceSelector(aTokenAddress)?.value || BigNumber.from(0)

  return userATokenBalance
}
