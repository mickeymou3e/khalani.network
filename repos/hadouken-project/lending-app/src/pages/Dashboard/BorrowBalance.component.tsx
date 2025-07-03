import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS } from '@constants/Lending'
import { REFRESH_TOOLTIPS_MS } from '@constants/Numbers'
import { balancesSelectors } from '@store/balances/balances.selector'
import { pricesSelectors } from '@store/prices/prices.selector'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { Balance } from '@utils/table'

const BorrowBalance: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_timeStamp, setTimeStamp] = useState(
    BigNumber.from(Date.now()).div(1000),
  )

  const tokenBorrowBalance = useSelector(
    balancesSelectors.selectUserBorrowBalance,
  )
  const reserves = useSelector(reservesSelectors.selectAll)
  const token = tokenBorrowBalance(tokenAddress)

  const selectPriceById = useSelector(pricesSelectors.selectById)
  const tokenReserve = reserves.find(
    (reserve) =>
      reserve.stableDebtTokenAddress === tokenAddress ||
      reserve.variableDebtTokenAddress === tokenAddress,
  )

  const price = selectPriceById(tokenReserve?.symbol).price

  const tokenPriceInDollars = token?.value
    ? token?.value
        .mul(price)
        .div(BigNumber.from(10).pow(CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS))
    : BigNumber.from(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStamp(BigNumber.from(Date.now()).div(1000))
    }, REFRESH_TOOLTIPS_MS)
    return () => clearInterval(timer)
  })

  return (
    <Balance
      balance={token?.value ?? BigNumber.from(0)}
      decimals={token?.decimals ?? 0}
      tokenPriceInDollars={tokenPriceInDollars}
      textAlign={{ xs: 'right', md: 'left' }}
    />
  )
}

export default BorrowBalance
