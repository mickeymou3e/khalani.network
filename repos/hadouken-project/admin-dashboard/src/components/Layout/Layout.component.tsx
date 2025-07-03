import React from 'react'

import FooterContainer from '@containers/FooterContainer'
import { Layout as UILayout } from '@hadouken-project/ui'
import Box from '@mui/material/Box'

const Layout: React.FC = ({ children }) => (
  <UILayout>
    <Box sx={{ minHeight: '68vh' }}>{children}</Box>

    <FooterContainer />
  </UILayout>
)

export default Layout
