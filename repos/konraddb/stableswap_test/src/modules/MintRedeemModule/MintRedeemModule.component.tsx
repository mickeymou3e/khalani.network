import React from 'react'

import MintHeader from '@components/MintHeader'
import { Page } from '@constants/Page'
import MintContainer from '@containers/MintContainer/MintContainer.component'
import RedeemContainer from '@containers/RedeemContainer/RedeemContainer.component'
import { Grid } from '@mui/material'

interface LiquidityModuleProps {
  page: Page
}

const MintRedeemModule: React.FC<LiquidityModuleProps> = (props) => {
  const { page } = props

  const expectedContainer =
    page === Page.Mint ? <MintContainer /> : <RedeemContainer />

  return (
    <Grid container display="flex" alignItems="center" justifyContent="center">
      <Grid item xs={12} lg={7} xl={5}>
        <MintHeader />
        {expectedContainer}
      </Grid>
    </Grid>
  )
}

export default MintRedeemModule
