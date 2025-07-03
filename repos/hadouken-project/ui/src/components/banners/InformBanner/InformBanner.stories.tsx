import React, { ComponentProps } from 'react'

import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import InformBanner from './InformBanner.component'

export default {
  title: 'Components/Banners/InformBanner',
  description: '',
  component: InformBanner,
}

type Story = StoryObj<ComponentProps<typeof InformBanner>>

const Template: Story = {
  render: (args) => (
    <Box>
      <InformBanner {...args}></InformBanner>
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  text: 'Please change network before proceeding',
}

const TemplateWithButton: Story = {
  render: (args) => (
    <Box>
      <InformBanner {...args}>
        <Button
          sx={{
            ml: 2,
            color: (theme) => theme.palette.common.black,
            borderColor: (theme) => theme.palette.common.black,
          }}
          variant="outlined"
          size="small"
        >
          Change network
        </Button>
      </InformBanner>
    </Box>
  ),
}

export const WithButton = { ...TemplateWithButton }

WithButton.args = {
  text: 'Please change network before proceeding',
}
