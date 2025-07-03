import React from 'react'
import { useSelector } from 'react-redux'

import { Table } from '@hadouken-project/ui'
import { networkSelectors } from '@store/network/network.selector'

import { createPoolDetailsRows, poolDetailsColumn } from './PoolDetails.table'
import { IPoolDetailsProps } from './PoolDetails.types'

const PoolDetails: React.FC<IPoolDetailsProps> = (props) => {
  const chainId = useSelector(networkSelectors.applicationChainId)
  const rows = createPoolDetailsRows(props, chainId)

  return <Table columns={poolDetailsColumn} rows={rows} />
}

export default PoolDetails
