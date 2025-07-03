import React from 'react'

import { Grid } from '@mui/material'

import { Network } from '../../constants/Networks'
import { Page } from '../../constants/Page'
import ExplorerLastTransactions from './ExplorerLastTransactions.component'
import ExplorerTransactionDetails from './ExplorerTransactionDetails.component'

interface ExplorerModuleProps {
  availableSourceNetworks: Network[]
  page: Page
}

const ExplorerModule: React.FC<ExplorerModuleProps> = ({
  availableSourceNetworks,
  page,
}) => {
  if (page === Page.ExplorerList) {
    return (
      <Grid
        container
        display="flex"
        alignItems="center"
        justifyContent="center"
        mt={4}
      >
        <ExplorerLastTransactions networks={availableSourceNetworks} />
      </Grid>
    )
  }

  if (page === Page.ExplorerDetails) {
    return (
      <ExplorerTransactionDetails
        availableSourceNetworks={availableSourceNetworks}
      />
    )
  }

  return null
}

export default ExplorerModule
