import React, { ComponentProps, useState } from 'react'

import { chains } from '@constants/chains'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react'

import NetworkDetails from './NetworkDetails.component'

export default {
  title: 'Components/Account/NetworkDetails',
  description: '',
  component: NetworkDetails,
}

const Template: Story<ComponentProps<typeof NetworkDetails>> = (args) => {
  const [chain, setChain] = useState(chains[1])
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height={300}
    >
      <Box
        bgcolor={(theme) => theme.palette.elevation.main}
        p={2}
        borderRadius={3}
      >
        <NetworkDetails
          {...args}
          selectedChainId={chain.id}
          onChainSelect={setChain}
        />
      </Box>
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  chains,
}
