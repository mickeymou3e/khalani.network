import React, { ComponentProps } from 'react'

import Button from '@components/buttons/Button'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import errorPatternBackgroundImage from '../../../../storybook/images/error-pattern.svg'
import ErrorBanner from './ErrorBanner.component'

export default {
  title: 'Components/Banners/ErrorBanner',
  description: '',
  component: ErrorBanner,
}

const Template: Story<ComponentProps<typeof ErrorBanner>> = (args) => (
  <Box>
    <ErrorBanner {...args}></ErrorBanner>
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  backgroundImageUrl: errorPatternBackgroundImage,
  text: 'You Must Create Nervos Layer 2 Account',
  noFill: false,
}

const CustomHeightTemplate: Story<ComponentProps<typeof ErrorBanner>> = (
  args,
) => (
  <Box>
    <ErrorBanner {...args}>
      <Box display="flex" alignItems="center" height={70}></Box>
    </ErrorBanner>
  </Box>
)

export const CustomHeight = CustomHeightTemplate.bind({})

CustomHeight.args = {
  backgroundImageUrl: errorPatternBackgroundImage,
  text: 'You Must Create Nervos Layer 2 Account',
  noFill: false,
}

const WithButtonTemplate: Story<ComponentProps<typeof ErrorBanner>> = (
  args,
) => (
  <Box>
    <ErrorBanner {...args}>
      <Button
        sx={{ width: 100, height: 40 }}
        variant="text"
        text="Create account"
      />
    </ErrorBanner>
  </Box>
)

export const ErrorLabelButton = WithButtonTemplate.bind({})

ErrorLabelButton.args = {
  backgroundImageUrl: errorPatternBackgroundImage,
  text: 'You Must Create Nervos Layer 2 Account',
  noFill: false,
}
