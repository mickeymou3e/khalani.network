import React, { ComponentProps } from 'react'

import { LogoIcon } from '@components/icons/logo/Logo'
import { Box, Typography } from '@mui/material'
import { StoryObj } from '@storybook/react'

import Footer from './'

export default {
  title: 'Components/Footer',
  description: '',
  component: Footer,
}

type Story = StoryObj<ComponentProps<typeof Footer>>

const Template: Story = {
  render: (args) => (
    <Box>
      <Typography sx={{ height: 100 }}>test</Typography>
      <Typography sx={{ height: 100 }}>test</Typography>
      <Typography sx={{ height: 100 }}>test</Typography>

      <Footer {...args} />
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  logo: LogoIcon,
  githubLink: 'https://github.com',
  discordLink: 'https://discord.com/invite/pxZJpJPJBH',
  twitterLink: 'https://twitter.com/HadoukenFinance',
}
