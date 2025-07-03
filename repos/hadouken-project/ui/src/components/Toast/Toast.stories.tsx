import React, { ComponentProps } from 'react'

import { Box } from '@mui/material'
import { StoryObj } from '@storybook/react'

import Toast from './Toast.component'
import { ToastVariant } from './Toast.types'

export default {
  title: 'Components/Toast',
  description: '',
  component: Toast,
}

type Story = StoryObj<ComponentProps<typeof Toast>>

const Template: Story = {
  render: (args) => {
    return (
      <Box width="100%" p={3}>
        <Toast {...args} />
      </Box>
    )
  },
}

export const Success = { ...Template }

Success.args = {
  message: 'Very long line of text. More than single line like this',
  variant: ToastVariant.Success,
}

export const Error = { ...Template }

Error.args = {
  message: 'Very long line of text. More than single line like this',
  variant: ToastVariant.Error,
}

export const Warning = { ...Template }

Warning.args = {
  message: 'Very long line of text. More than single line like this',
  variant: ToastVariant.Warning,
}

export const Info = { ...Template }

Info.args = {
  message: 'Very long line of text. More than single line like this',
  variant: ToastVariant.Info,
}
