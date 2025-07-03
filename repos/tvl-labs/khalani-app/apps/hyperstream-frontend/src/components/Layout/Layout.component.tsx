import React from 'react'

import { IChildren } from '@interfaces/children'
import { Box } from '@mui/material'
import { FooterContainer } from '@shared/containers'
import { Layout as LayoutUI } from '@tvl-labs/khalani-ui'

import { HeaderContainer } from '../../containers'

const Layout: React.FC<IChildren> = ({ children }) => (
  <Box>
    <HeaderContainer />

    <LayoutUI>{children}</LayoutUI>
    <FooterContainer />
  </Box>
)

export default Layout
