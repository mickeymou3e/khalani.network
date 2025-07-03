import React, { ComponentProps } from 'react'

import { Box, Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import InternalTabsSelector from './InternalTabsSelector.component'

export default {
  title: 'Components/Selectors/InternalTabsSelector',
  description: '',
  component: InternalTabsSelector,
}

const Template: Story<ComponentProps<typeof InternalTabsSelector>> = (args) => (
  <Container maxWidth="md" sx={{ mt: 5, position: 'relative' }}>
    <Box width={570}>
      <Paper elevation={2} sx={{ py: 5, px: 2 }}>
        <InternalTabsSelector {...args} />
      </Paper>
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
