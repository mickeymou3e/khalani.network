import React, { ComponentProps } from 'react'

import { Box, Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import TextTabsSelector from './TextTabsSelector.component'

export default {
  title: 'Components/Selectors/TextTabsSelector',
  description: '',
  component: TextTabsSelector,
}

const Template: Story<ComponentProps<typeof TextTabsSelector>> = (args) => (
  <Container maxWidth="md" sx={{ mt: 5, position: 'relative' }}>
    <Box width={570}>
      <Paper elevation={2} sx={{ py: 5, px: 2 }}>
        <TextTabsSelector {...args} />
      </Paper>
    </Box>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  tabs: [
    { label: 'Assets', value: 0 },
    { label: 'History', value: 1 },
  ],
  selectedTab: 0,
}
