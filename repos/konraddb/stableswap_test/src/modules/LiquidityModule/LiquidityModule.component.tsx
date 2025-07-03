import React from 'react'

import LiquidityHeader from '@components/LiqudityHeader'
import { Page } from '@constants/Page'
import LiquidityAddContainer from '@containers/liquidity/LiquidityAddContainer'
import LiquidityListContainer from '@containers/liquidity/LiquidityListContainer'
import LiquidityRemoveContainer from '@containers/liquidity/LiquidityRemoveContainer'
import { Grid } from '@mui/material'

interface LiquidityModuleProps {
  page: Page
}

const LiquidityModule: React.FC<LiquidityModuleProps> = (props) => {
  const { page } = props

  if (page === Page.Liquidity) {
    return <LiquidityListContainer />
  }

  const expectedContainer =
    page === Page.LiquidityAdd ? (
      <LiquidityAddContainer />
    ) : (
      <LiquidityRemoveContainer />
    )

  return (
    <Grid container display="flex" alignItems="center" justifyContent="center">
      <Grid item xs={12} lg={7} xl={5}>
        <LiquidityHeader />
        {expectedContainer}
      </Grid>
    </Grid>
  )
}

export default LiquidityModule
