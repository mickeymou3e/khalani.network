import React from 'react'

import { ChangeNetworkBanner } from '@components/banners/ChangeNetworkBanner/ChangeNetworkBanner.component'
import { SelectNetwork } from '@components/modals/SelectNetwork'
import BreadCrumbContainer from '@containers/BreadCrumbContainer'
import ErrorManagerContainer from '@containers/ErrorManagerContainer'
import FooterContainer from '@containers/FooterContainer'
import HeaderContainer from '@containers/HeaderContainer'
import { Layout as UILayout, WarningBanner } from '@hadouken-project/ui'
import { Box, Typography } from '@mui/material'

import { usePathWatcher } from '../../hooks/usePathWatcher'

const Layout: React.FC = ({ children }) => {
  usePathWatcher()
  return (
    <>
      <Box position="sticky" top={0} zIndex={1000}>
        <Box display="flex" flexDirection="column" gap={0.5}>
          <WarningBanner
            title="Important Notice:"
            description={
              <Box>
                <Typography variant="buttonSmall">
                  We will be discontinuing the Hadouken product. The final day
                  of service will be
                  <b> December 31, 2024</b>.
                </Typography>
                <Typography sx={{ pt: 0.5 }} variant="buttonSmall">
                  Please close all your positions and withdraw all your assets
                  by the end of this year.
                </Typography>
              </Box>
            }
          />
          <ChangeNetworkBanner />
        </Box>

        <SelectNetwork shouldBeAlwaysOpen={false} />

        <HeaderContainer />
      </Box>

      <UILayout>
        <Box ml={3} pt={2} pb={2}>
          <BreadCrumbContainer />
        </Box>

        <Box sx={{ minHeight: '100vh' }}>{children}</Box>
      </UILayout>
      <ErrorManagerContainer />

      <FooterContainer />
    </>
  )
}

export default Layout
