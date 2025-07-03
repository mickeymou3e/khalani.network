import React from 'react'

import { Box } from '@mui/material'
import { Layout as LayoutUI } from '@tvl-labs/khalani-ui'

import FooterContainer from '../../containers/FooterContainer'
import HeaderContainer from '../../containers/HeaderContainer'

const Layout: React.FC = ({ children }) => (
  <Box>
    <HeaderContainer />

    <Box
      px={{
        md: 4,
        xs: 2,
      }}
    >
      <LayoutUI>{children}</LayoutUI>
    </Box>

    <FooterContainer />
  </Box>
)

export default Layout
