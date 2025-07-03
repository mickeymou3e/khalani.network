import React from 'react'

import ChangeNetworkBanner from '@components/banners/ChangeNetworkBanner'
import BreadCrumbContainer from '@containers/BreadCrumbContainer'
import ErrorManagerContainer from '@containers/ErrorManagerContainer'
import FooterContainer from '@containers/FooterContainer'
import HeaderContainer from '@containers/HeaderContainer'
import { Layout as LayoutUI } from '@hadouken-project/ui'
import { Box } from '@mui/material'

const Layout: React.FC = ({ children }) => (
  <>
    <Box position="sticky" top={0} zIndex={1000}>
      <ChangeNetworkBanner />
      <HeaderContainer />
    </Box>

    <LayoutUI>
      <Box ml={3} pt={2} pb={2}>
        <BreadCrumbContainer />
      </Box>
      <Box sx={{ minHeight: '100vh' }}>{children}</Box>
    </LayoutUI>
    <ErrorManagerContainer />
    <FooterContainer />
  </>
)

export default Layout
