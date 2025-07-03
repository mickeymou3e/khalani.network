import React, { ComponentProps, useState } from 'react'

import Button from '@components/buttons/Button'
import SlippageTolerance from '@components/inputs/SlippageTolerance'
import { Box, Container } from '@mui/material'
import { Story } from '@storybook/react'

import InternalDrawer from './InternalDrawer.component'
import { messages } from './InternalDrawer.messages'

export default {
  title: 'Components/InternalDrawer',
  description: '',
  component: InternalDrawer,
}

const Template: Story<ComponentProps<typeof InternalDrawer>> = (args) => {
  const [value, setValue] = useState<bigint | undefined>()

  return (
    <Container
      maxWidth="md"
      sx={{ mt: 5, position: 'relative', width: 500, height: 400 }}
    >
      <InternalDrawer {...args}>
        <Box pt={2}>
          <SlippageTolerance
            onValueChange={() => true}
            value={value}
            setValue={setValue}
          ></SlippageTolerance>
          <Button
            color="primary"
            size="large"
            variant="contained"
            fullWidth
            text={messages.BUTTON_LABEL}
            sx={{ mt: 1.25 }}
          />
        </Box>
      </InternalDrawer>
    </Container>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  header: 'Settings',
  subheader: 'Customize your action',
}
