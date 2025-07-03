import React, { ComponentProps, useEffect, useState } from 'react'

import Button from '@components/buttons/Button'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import UserAddressesModal from './UserAddressesModal.component'

export default {
  title: 'Components/Modals/UserAddressesModal',
  description: '',
  component: UserAddressesModal,
}

const Template: Story<ComponentProps<typeof UserAddressesModal>> = (args) => {
  const [open, setOpen] = useState(args.open)

  useEffect(() => {
    setOpen(args.open)
  }, [args.open])

  const onClick = () => {
    setOpen(true)
  }

  const addresses = [
    {
      address: '0x16948b579240a89d306901dc7d91ad2dbc058fd4',
      networkName: 'Godwoken',
      explorers: [
        {
          url: 'https://aggron.layerview.io/account/',
          name: 'Godwoken explorer',
        },
      ],
    },
    {
      address:
        'ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdxxrhcumcpxlt49l5nafp47r6p40n5uxluug7e2km',
      networkName: 'Nervos CKB',
      explorers: [
        {
          url: 'https://explorer.nervos.org/aggron/address/',
          name: 'CKB explorer',
        },
      ],
    },
  ]

  return (
    <Box>
      <Button onClick={onClick} text="Open" />
      <UserAddressesModal
        open={open}
        handleClose={() => setOpen(false)}
        title="Account"
        addresses={addresses}
      />
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  open: true,
}
