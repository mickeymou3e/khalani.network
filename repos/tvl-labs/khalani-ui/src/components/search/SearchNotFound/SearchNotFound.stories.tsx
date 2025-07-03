import React, { ComponentProps } from 'react'

import { Paper } from '@mui/material'
import { Story } from '@storybook/react'

import SearchNotFound from './SearchNotFound.component'

// export default {
//   title: 'Components/Search/SearchNotFound',
//   description: '',
//   component: SearchNotFound,
//   argTypes: { valueChangeHandler: { action: 'typed' } },
// }

export default { component: SearchNotFound }
const Template: Story<ComponentProps<typeof SearchNotFound>> = (args) => (
  <Paper>
    <SearchNotFound {...args} />
  </Paper>
)

export const Basic = Template.bind({})

Basic.args = {
  searchPhrase: 'search text',
  tryAgainText: 'Please try searching another token',
}
