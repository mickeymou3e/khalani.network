import React, { ComponentProps } from 'react'

import Button from '@components/buttons/Button'
import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import errorPatternBackgroundImage from '../../../../storybook/images/error-pattern.svg'
import ErrorBanner from './ErrorBanner.component'

export default {
  title: 'Components/Banners/ErrorBanner',
  description: '',
  component: ErrorBanner,
}

type Story = StoryObj<ComponentProps<typeof ErrorBanner>>

const Template: Story = {
  render: (args) => (
    <Box>
      <ErrorBanner {...args}></ErrorBanner>
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  backgroundImageUrl: errorPatternBackgroundImage,
  text: 'You Must Create Nervos Layer 2 Account',
  noFill: false,
}

const CustomHeightTemplate: Story = {
  render: (args) => (
    <Box>
      <ErrorBanner {...args}>
        <Box display="flex" alignItems="center" height={70}></Box>
      </ErrorBanner>
    </Box>
  ),
}

export const CustomHeight = { ...CustomHeightTemplate }

CustomHeight.args = {
  backgroundImageUrl: errorPatternBackgroundImage,
  text: 'You Must Create Nervos Layer 2 Account',
  noFill: false,
}

const WithButtonTemplate: Story = {
  render: (args) => (
    <Box>
      <ErrorBanner {...args}>
        <Button
          sx={{ width: 100, height: 40 }}
          variant="text"
          text="Create account"
        />
      </ErrorBanner>
    </Box>
  ),
}

export const ErrorLabelButton = { ...WithButtonTemplate }

ErrorLabelButton.args = {
  backgroundImageUrl: errorPatternBackgroundImage,
  text: 'You Must Create Nervos Layer 2 Account',
  noFill: false,
}
