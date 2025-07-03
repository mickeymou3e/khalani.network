import React, { ComponentProps } from 'react'

import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import InformBanner from './InformBanner.component'

export default {
  title: 'Components/Banners/InformBanner',
  description: '',
  component: InformBanner,
}

const Template: Story<ComponentProps<typeof InformBanner>> = (args) => (
  <Box>
    <InformBanner {...args}></InformBanner>
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  text: 'Please change network before proceeding',
}

const TemplateWithButton: Story<ComponentProps<typeof InformBanner>> = (
  args,
) => (
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
)

export const WithButton = TemplateWithButton.bind({})

WithButton.args = {
  text: 'Please change network before proceeding',
}
