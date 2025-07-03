import React, { ComponentProps } from 'react'

import { Paper } from '@mui/material'
import { StoryObj } from '@storybook/react'

import SearchNotFound from './SearchNotFound.component'

export default {
  title: 'Components/Search/SearchNotFound',
  description: '',
  component: SearchNotFound,
  argTypes: { valueChangeHandler: { action: 'typed' } },
}

type Story = StoryObj<ComponentProps<typeof SearchNotFound>>

const Template: Story = {
  render: (args) => (
    <Paper>
      <SearchNotFound {...args} />
    </Paper>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  searchPhrase: 'search text',
  tryAgainText: 'Please try searching another token',
}
