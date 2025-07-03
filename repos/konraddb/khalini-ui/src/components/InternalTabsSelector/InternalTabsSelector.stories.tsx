import React, { ComponentProps } from 'react'

import { Box, Container } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import InternalTabsSelector from './InternalTabsSelector.component'

export default {
  title: 'Components/InternalTabsSelector',
  description: '',
  component: InternalTabsSelector,
}

const Template: Story<ComponentProps<typeof InternalTabsSelector>> = (args) => (
  <Container maxWidth="sm" sx={{ mt: 5, position: 'relative' }}>
    <Box display="flex" justifyContent="center" height={400}>
      <InternalTabsSelector {...args} />
    </Box>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  tabs: [
    { label: 'Add', value: 0, route: 'add' },
    { label: 'Remove', value: 1, route: 'remove' },
  ],
  selectedTab: 0,
}
