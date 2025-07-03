import React, { ComponentProps } from 'react'

import { Box, Container } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import InternalDrawer from './InternalDrawer.component'

export default {
  title: 'Components/InternalDrawer',
  description: '',
  component: InternalDrawer,
}

const Template: Story<ComponentProps<typeof InternalDrawer>> = (args) => (
  <Container maxWidth="sm" sx={{ mt: 5, position: 'relative' }}>
    <Box display="flex" justifyContent="center" height={400}>
      <InternalDrawer {...args} />
    </Box>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  header: 'Setting',
  subheader: 'Customize your action',
}
