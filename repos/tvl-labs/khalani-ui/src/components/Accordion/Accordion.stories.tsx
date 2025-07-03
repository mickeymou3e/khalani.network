import React, { ComponentProps } from 'react'

import Typography from '@components/Typography'
import { Container, Paper, Stack } from '@mui/material'
import { Story } from '@storybook/react'

import Accordion from './'

export default {
  title: 'Components/Accordion',
  description: '',
  component: Accordion,
}

const Template: Story<ComponentProps<typeof Accordion>> = (args) => (
  <Container
    maxWidth="md"
    sx={{ mt: 5, position: 'relative', width: 500, height: 400 }}
  >
    <Paper elevation={2} sx={{ px: 2, py: 4 }}>
      <Accordion {...args}></Accordion>
    </Paper>
  </Container>
)

const accordionArgs = {
  summary: (
    <Stack direction="row" alignItems="center">
      <Typography
        text={'Transaction Processing'}
        variant="button"
        color="text.secondary"
      />
    </Stack>
  ),
  details: (
    <Stack direction="row" alignItems="center">
      <Typography text={'Details'} variant="button" color="text.secondary" />
    </Stack>
  ),
}

export const Basic = Template.bind({})

Basic.args = accordionArgs

export const AlwaysExpanded = Template.bind({})

AlwaysExpanded.args = {
  ...accordionArgs,
  isAlwaysExpanded: true,
}
