import React, { ComponentProps, useState } from 'react'

import { Box } from '@mui/material'
import { Story } from '@storybook/react'

import SearchField from './SearchField.component'

export default {
  title: 'Components/Search/SearchField',
  description: '',
  component: SearchField,
}

const Template: Story<ComponentProps<typeof SearchField>> = (args) => {
  const [value, setValue] = useState('')

  return (
    <Box width={620} margin="32px auto">
      <SearchField
        value={value}
        valueChangeHandler={(e) => {
          setValue(e)
        }}
        {...args}
      />
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  handleSearchClick: () => true,
  placeholder: 'Search TXN Hash',
}

export const NotFound = Template.bind({})

NotFound.args = {
  placeholder: 'Search TXN Hash',
  notFound: true,
}

export const Loading = Template.bind({})

Loading.args = {
  placeholder: 'Search TXN Hash',
  loading: true,
}
