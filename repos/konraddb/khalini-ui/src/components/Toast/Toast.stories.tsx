import React, { ComponentProps } from 'react'

import { Box } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import Toast from './Toast.component'
import { ToastVariant } from './Toast.types'

export default {
  title: 'Components/Toast',
  description: '',
  component: Toast,
}

const Template: Story<ComponentProps<typeof Toast>> = (args) => {
  return (
    <Box width="100%" p={3}>
      <Toast {...args} />
    </Box>
  )
}

export const Success = Template.bind({})

Success.args = {
  message: 'Very long line of text. More than single line like this',
  variant: ToastVariant.Success,
}

export const Error = Template.bind({})

Error.args = {
  message: 'Very long line of text. More than single line like this',
  variant: ToastVariant.Error,
}

export const Warning = Template.bind({})

Warning.args = {
  message: 'Very long line of text. More than single line like this',
  variant: ToastVariant.Warning,
}

export const Info = Template.bind({})

Info.args = {
  message: 'Very long line of text. More than single line like this',
  variant: ToastVariant.Info,
}
