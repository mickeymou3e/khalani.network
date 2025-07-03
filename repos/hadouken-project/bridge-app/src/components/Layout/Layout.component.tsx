import React from 'react'

import { ChangeNetworkBanner } from '@components/banners/ChangeNetworkBanner/ChangeNetworkBanner.component'
import BreadCrumbContainer from '@containers/BreadCrumbContainer'
import FooterContainer from '@containers/FooterContainer'
import HeaderContainer from '@containers/HeaderContainer'
import { Layout as UILayout, WarningBanner } from '@hadouken-project/ui'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'

const Layout: React.FC = ({ children }) => (
  <>
    <Box position="sticky" top={0} zIndex={1000}>
      <Box display="flex" flexDirection="column" gap={0.5}>
        <ChangeNetworkBanner />
        <WarningBanner
          title="Important Notice:"
          description={
            <Box>
              <Typography variant="buttonSmall">
                We will be discontinuing the Hadouken product. The final day of
                service will be
                <b> December 31, 2024</b>.
              </Typography>
              <Typography sx={{ pt: 0.5 }} variant="buttonSmall">
                Please close all your positions and withdraw all your assets by
                the end of this year.
              </Typography>
            </Box>
          }
        />
      </Box>
      <HeaderContainer />
    </Box>

    <UILayout>
      <Box ml={3} pt={2} pb={2}>
        <BreadCrumbContainer />
      </Box>

      <Box sx={{ minHeight: '100vh' }}>{children}</Box>
    </UILayout>

    <FooterContainer />
  </>
)

export default Layout
