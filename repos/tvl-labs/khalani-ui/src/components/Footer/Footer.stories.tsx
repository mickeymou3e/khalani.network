import React, { ComponentProps } from 'react'

import { Box, Typography } from '@mui/material'
import { Story } from '@storybook/react'

import Footer from './'

export default {
  title: 'Components/Footer',
  description: '',
  component: Footer,
}

const Template: Story<ComponentProps<typeof Footer>> = (args) => (
  <Box>
    <Typography sx={{ height: 100 }}>test</Typography>
    <Typography sx={{ height: 100 }}>test</Typography>
    <Typography sx={{ height: 100 }}>test</Typography>

    <Footer {...args} />
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  githubLink: 'https://github.com',
  discordLink: 'https://discord.com/invite/pxZJpJPJBH',
  twitterLink: 'https://twitter.com/HadoukenFinance',
}
