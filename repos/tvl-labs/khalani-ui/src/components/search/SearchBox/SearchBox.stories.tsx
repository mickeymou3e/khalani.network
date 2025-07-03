import React, { ComponentProps, useState } from 'react'

import { Paper } from '@mui/material'
import { Story } from '@storybook/react'

import SearchBox from './SearchBox.component'

export default {
  title: 'Components/Search/SearchBox',
  description: '',
  component: SearchBox,
  argTypes: { valueChangeHandler: { action: 'typed' } },
}

const Template: Story<ComponentProps<typeof SearchBox>> = ({
  valueChangeHandler,
}) => {
  const [value, setValue] = useState('')

  return (
    <Paper>
      <SearchBox
        value={value}
        valueChangeHandler={(e) => {
          setValue(e)
          valueChangeHandler?.(e)
        }}
      />
    </Paper>
  )
}

export const Basic = Template.bind({})

Basic.args = {}
