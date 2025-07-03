import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS } from '@constants/Lending'
import {
  IRow,
  convertBigNumberToDecimal,
  convertNumberToStringWithCommas,
  getTokenIconComponent,
} from '@hadouken-project/ui'
import { IReserve, TokenModel } from '@interfaces/tokens'
import { pricesSelectors } from '@store/prices/prices.selector'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { bigNumberPercentage, createIconCell } from '@utils/table'

const createRow = (
  reserve: IReserve,
  price: BigNumber,
  token?: TokenModel,
): IRow => {
  const totalBorrowed = reserve.totalStableDebt.add(reserve.totalVariableDebt)
  const marketSize = reserve?.availableLiquidity.add(totalBorrowed)

  const totalBorrowedInDollars = totalBorrowed
    .mul(price)
    .div(BigNumber.from(10).pow(CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS))

  const marketSizeInDollars = marketSize
    .mul(price)
    .div(BigNumber.from(10).pow(CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS))

  const TokenIcon = getTokenIconComponent(token?.symbol)
  const row: IRow = {
    id: reserve?.address,
    cells: {
      assets: {
        value: createIconCell(
          <TokenIcon width={40} height={40} />,
          token?.symbol,
        ),
        sortingValue: token?.symbol,
      },
      market: {
        value: `$${convertNumberToStringWithCommas(
          Number(
            convertBigNumberToDecimal(
              marketSizeInDollars,
              token?.decimals ?? 0,
            ),
          ),
        )}`,
        sortingValue: Number(
          convertBigNumberToDecimal(marketSizeInDollars, token?.decimals ?? 0),
        ),
      },
      borrowed: {
        value: `$${convertNumberToStringWithCommas(
          Number(
            convertBigNumberToDecimal(
              totalBorrowedInDollars,
              token?.decimals ?? 0,
            ),
          ),
        )}`,
        sortingValue: Number(
          convertBigNumberToDecimal(
            totalBorrowedInDollars,
            token?.decimals ?? 0,
          ),
        ),
      },
      apy: {
        value: bigNumberPercentage(reserve?.liquidityRate),
      },
      variableBorrow: {
        value: bigNumberPercentage(reserve?.variableBorrowRate),
      },
      // TODO-HDK-652 bring back stable borrow
      // stableBorrow: {
      //   value: bigNumberPercentage(reserve?.stableBorrowRate),
      // },
    },
  }
  return row
}

export const useReserveList = ({
  sortingColumn,
  sortDesc,
}: {
  sortingColumn: string
  sortDesc: boolean | undefined
}): IRow[] => {
  const tokens = useSelector(tokenSelectors.tokens)
  const prices = useSelector(pricesSelectors.selectAll)
  const reserves = useSelector(reservesSelectors.selectAll)
  const [reserveList, setReserveList] = useState<IRow[]>([])
  const isFetching = useSelector(reservesSelectors.isFetching)

  useEffect(() => {
    if (isFetching) {
      setReserveList([])
      return
    }
    setReserveList(
      reserves

        .map((reserve) =>
          createRow(
            reserve,
            prices.find((price) => price.id === reserve.symbol)?.price ||
              BigNumber.from(0),
            tokens.find((tok) => tok.address === reserve.address),
          ),
        )
        .sort((rowA, rowB) => {
          const columnA = Number(rowA.cells[sortingColumn]?.sortingValue ?? 0)
          const columnB = Number(rowB.cells[sortingColumn]?.sortingValue ?? 0)

          if (sortDesc === undefined) {
            return 0
          } else if (sortDesc) {
            return columnB - columnA
          }

          return columnA - columnB
        }),
    )
  }, [reserves, tokens, isFetching, prices, sortDesc, sortingColumn])

  return reserveList
}
