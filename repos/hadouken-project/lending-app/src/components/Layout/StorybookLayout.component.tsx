import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { Header, IHeaderProps, LinkEnum } from '@hadouken-project/ui'
import { Box } from '@mui/material'

export const StorybookLayout: React.FC = ({ children }) => {
  const HeaderProps: IHeaderProps = {
    RouterLink: Router,
    chainId: 1,

    ethAddress: '0x2B2F3651ae95edf3F0fA175bf99A8512078979DD',
    items: [
      {
        id: '1',
        text: 'App 1',
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
        id: '2',
        text: 'App 2',
        pages: [
          {
            id: 'item 2',
            text: 'MENU ITEM 2',
            href: '2',
            linkType: LinkEnum.Internal,
          },
        ],
      },
    ],
  }
  return (
    <>
      <Header {...HeaderProps} />
      <Box pt={4}>{children}</Box>
    </>
  )
}
