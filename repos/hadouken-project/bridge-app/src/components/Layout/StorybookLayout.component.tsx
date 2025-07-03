import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { Header, IHeaderProps, LinkEnum } from '@hadouken-project/ui'
import { Box } from '@mui/material'

export const StorybookLayout: React.FC = ({ children }) => {
  const HeaderProps: IHeaderProps = {
    RouterLink: Router,
    ethAddress: '0x2B2F3651ae95edf3F0fA175bf99A8512078979DD',
    items: [
      {
        text: 'MENU ITEM 1',
        id: '1',
        pages: [
          {
            id: 'item 1',
            text: 'MENU ITEM 1',
            href: '1',
            linkType: LinkEnum.Internal,
          },
        ],
      },
      {
        text: 'MENU ITEM 2',
        id: '2',
        pages: [
          {
            id: 'item 1',
            text: 'MENU ITEM 1',
            href: '1',
            linkType: LinkEnum.Internal,
          },
        ],
      },
    ],
    chainId: 0,
  }
  return (
    <>
      <Header {...HeaderProps} />
      <Box pt={4}>{children}</Box>
    </>
  )
}
