import React, { ComponentProps } from 'react'

import { Paper } from '@mui/material'
import { StoryObj } from '@storybook/react'

import { NotFoundPage } from './NotFoundPage.component'

export default {
  title: 'Components/NotFoundPage',
  description: '',
  component: NotFoundPage,
}

type Story = StoryObj<ComponentProps<typeof NotFoundPage>>

const Template: Story = {
  render: () => {
    const onRedirect = () => {
      return null
    }

    return (
      <Paper>
        <NotFoundPage onRedirect={onRedirect} />
      </Paper>
    )
  },
}

export const Basic = { ...Template }
