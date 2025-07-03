import React, { ComponentProps } from 'react'

import { LinkEnum } from '@components/Link'
import Button from '@components/buttons/Button'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react'

import MobileMenu from './MobileMenu.component'

export default {
  title: 'Components/Header/MobileMenu',
  description: '',
  component: MobileMenu,
}

const Template: Story<ComponentProps<typeof MobileMenu>> = (args) => {
  const [open, setOpen] = React.useState(args.open)

  return (
    <Box bgcolor="background.default" width="100%" height={600}>
      <div style={{ height: 80, backgroundColor: 'orange' }} />
      <Button text="open" onClick={() => setOpen(!open)} />
      <MobileMenu {...args} open={open} handleClose={() => setOpen(false)} />
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  open: true,
  items: [
    {
      text: 'Mint / Reedem',
      id: '1',
      pages: [
        {
          href: '4_2',
          id: '4_2',
          linkType: LinkEnum.Internal,
          text: 'Mint / Reedem',
        },
      ],
    },
    {
      text: 'Bridge',
      id: '2',
      pages: [
        {
          href: '4_2',
          id: '4_2',
          linkType: LinkEnum.Internal,
          text: 'Bridge',
        },
      ],
    },
    {
      text: 'Liquidity',
      id: '3',
      pages: [
        {
          href: '4_2',
          id: '4_2',
          linkType: LinkEnum.Internal,
          text: 'Liquidity',
        },
      ],
    },
  ],
}

export const Authenticated = Template.bind({})

Authenticated.args = {
  open: true,
  authenticated: true,
  ethAddress: '0x742971ac86E36152B9aac7090cF0B5C0acaa90F4',
  items: [
    {
      text: 'Trade',
      pages: [
        {
          href: 'Swap',
          id: 'Swap',
          linkType: LinkEnum.Button,
          text: 'Swap',
        },
      ],
      id: '1',
    },
    {
      text: 'Lending',
      pages: [
        {
          href: 'Deposit',
          id: 'Deposit',
          linkType: LinkEnum.Button,
          text: 'Deposit',
        },
        {
          href: 'Borrow',
          id: 'Borrow',
          linkType: LinkEnum.Button,
          text: 'Borrow',
        },
      ],
      id: '2',
    },
  ],
}
