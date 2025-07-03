import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { Box } from '@mui/material'
import { getBridgeRequestByTransactionHash } from '@pages/Explorer/sdk/sdk'
import { SearchField } from '@tvl-labs/khalani-ui'

import { ITransactionFilteringProps } from './TransactionFilteringContainer.types'

const TransactionFilteringContainer: React.FC<ITransactionFilteringProps> = (
  props,
) => {
  const { networks } = props
  const mountedRef = useRef(true)

  const [value, setValue] = useState<string>('')
  const [notFoundError, setNotFoundError] = useState<boolean>(false)
  const [loadingData, setLoadingData] = useState<boolean>(false)
  const history = useHistory()

  const handleSearchClick = async () => {
    setLoadingData(true)
    for (const [i, network] of networks.entries()) {
      const transaction = await getBridgeRequestByTransactionHash(
        value,
        network,
        true,
      ).catch(() => {
        errorActions()
      })
      if (!mountedRef.current) return
      if (!transaction && i === networks.length - 1) {
        errorActions()
      }
      if (transaction) {
        history.push(`/explorer/${value}`)
        break
      }
    }
  }

  const errorActions = () => {
    setNotFoundError(true)
    setLoadingData(false)
  }

  useEffect(
    () => () => {
      mountedRef.current = false
    },
    [],
  )

  const handleValueChange = (value: string) => {
    setValue(value)
    if (notFoundError) {
      setNotFoundError(false)
    }
  }

  return (
    <Box mb={3}>
      <SearchField
        handleSearchClick={handleSearchClick}
        placeholder="Search TXN Hash"
        value={value}
        valueChangeHandler={handleValueChange}
        notFound={notFoundError}
        loading={loadingData}
      />
    </Box>
  )
}

export default TransactionFilteringContainer
