import React, { ComponentProps } from 'react'

import { Paper } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import Paragraph from './Paragraph.component'

export default {
  title: 'Components/Paragraph',
  description: '',
  component: Paragraph,
}

const Template: Story<ComponentProps<typeof Paragraph>> = (args) => (
  <Paper>
    <Paragraph {...args} />
  </Paper>
)

export const Basic = Template.bind({})

Basic.args = {
  title: `Example title`,
  description: `Example description`,
}
