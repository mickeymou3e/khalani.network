import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { SearchBox, Table, TokenList } from '@hadouken-project/ui'
import { IToken } from '@interfaces/token'
import TableContainer from '@mui/material/TableContainer'
import { networkSelectors } from '@store/network/network.selector'
import { getPopularTokensList, isPopularToken } from '@utils/token'

import { DEFAULT_SORTING_COLUMN } from './PoolTable.constants'
import { poolColumns, useCreatePoolRows } from './PoolTable.table'
import { IPoolTable } from './PoolTable.types'

const sortTokens = (tokensArr: IToken[], chainId: string) =>
  tokensArr.sort((prevToken, nextToken) => {
    const popularTokensList = getPopularTokensList(chainId)
    const popularTokensListSymbols = popularTokensList.map(
      (token) => token.symbol,
    )

    return (
      popularTokensListSymbols.indexOf(prevToken.symbol) -
      popularTokensListSymbols.indexOf(nextToken.symbol)
    )
  })

const PoolTable: React.FC<IPoolTable> = ({ pools, tokens, onPoolClick }) => {
  const [searchText, setSearchText] = useState('')
  const chainId = useSelector(networkSelectors.applicationChainId)
  const [popularTokens, setPopularTokens] = useState<IToken[]>(
    tokens
      ? sortTokens(
          tokens.filter(({ address }) => isPopularToken(address, chainId)),
          chainId,
        )
      : [],
  )

  useEffect(() => {
    setPopularTokens(
      tokens
        ? sortTokens(
            tokens.filter(({ address }) => isPopularToken(address, chainId)),
            chainId,
          )
        : [],
    )
  }, [chainId, tokens])

  const [sortingColumn, setSortingColumn] = useState(DEFAULT_SORTING_COLUMN)
  const [sortDesc, setSortDesc] = useState<boolean | undefined>(true)

  const [selectedTokens, setSelectedTokens] = useState<IToken[]>([])

  const onSortColumn = (columnName: string) => {
    setSortingColumn(columnName)
  }

  const onSortDesc = (isDesc: boolean | undefined) => {
    if (isDesc === undefined) {
      setSortDesc(true)
    } else if (isDesc) {
      setSortDesc(undefined)
    } else {
      setSortDesc(false)
    }
  }

  const handlePopularTokenList = (id: string) => {
    const removedItem = popularTokens.find((token) => token.id === id)
    setSelectedTokens(
      removedItem ? [...selectedTokens, removedItem] : [...selectedTokens],
    )
    const filteredTokens = popularTokens?.filter((token) => token.id !== id)
    setPopularTokens(filteredTokens)
  }

  const handleSelectedTokenList = (id: string) => {
    const removedItem = selectedTokens?.find((token) => token.id === id)

    if (removedItem) {
      const sortedPopularTokens = sortTokens(
        [...popularTokens, removedItem],
        chainId,
      )

      setPopularTokens(sortedPopularTokens)
    }

    const filteredToken = selectedTokens?.filter((token) => token.id !== id)
    setSelectedTokens(filteredToken)
  }

  const rows = useCreatePoolRows(
    pools,
    searchText,
    selectedTokens,
    sortingColumn,
    sortDesc,
  )

  return (
    <>
      <SearchBox value={searchText} valueChangeHandler={setSearchText} />
      <TokenList
        popularTokensList={popularTokens}
        selectedTokenList={selectedTokens}
        handlePopularTokenList={handlePopularTokenList}
        handleSelectedTokenList={handleSelectedTokenList}
      />
      <TableContainer>
        <Table
          columns={poolColumns}
          rows={rows}
          onRowClick={onPoolClick}
          onSortColumn={onSortColumn}
          onSortDesc={onSortDesc}
          sortedColumnName={sortingColumn}
          sortDesc={sortDesc}
        />
      </TableContainer>
    </>
  )
}

export default PoolTable
