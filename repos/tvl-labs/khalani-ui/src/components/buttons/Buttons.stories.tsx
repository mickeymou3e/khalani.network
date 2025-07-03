import React, { ComponentProps } from 'react'

import { Box, Typography } from '@mui/material'
import { Story } from '@storybook/react'

import Button from './Button'
import RadioButton from './RadioButton'

export default {
  title: 'Components/Buttons',
  description: '',
  component: Button,
}

const Template: Story<ComponentProps<typeof Button>> = (args) => (
  <Box bgcolor="background.default" p={2}>
    <Box marginTop={3} display="flex" gap={10}>
      <Box display="flex" flexDirection="column">
        <Typography sx={{ display: 'flex' }} variant="h4">
          Buttons Contained Medium
        </Typography>
        <Box marginX={2}>
          <Box pt={2} display="flex" gap={4}>
            <Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Primary
              </Typography>
              <Button
                {...args}
                color="primary"
                size="medium"
                variant="contained"
              />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Primary disabled
              </Typography>
              <Button
                {...args}
                color="primary"
                size="medium"
                variant="contained"
                disabled
              />
            </Box>
          </Box>
          <Box pt={2} display="flex" gap={4}>
            <Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Secondary
              </Typography>
              <Button
                {...args}
                color="secondary"
                size="medium"
                variant="contained"
              />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Secondary disabled
              </Typography>
              <Button
                {...args}
                color="secondary"
                size="medium"
                variant="contained"
                disabled
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>

    <Box mt={3}>
      <Typography variant="h4">Radio buttons</Typography>
      <Box display="flex" m={2}>
        <Box marginX={2}>
          <Typography variant="h5">disabled</Typography>
          <RadioButton value="value" label="Radio button" disabled />
        </Box>

        <Box marginX={2}>
          <Typography variant="h5">disable checked</Typography>
          <RadioButton value="value" label="Radio button" disabled checked />
        </Box>

        <Box marginX={2}>
          <Typography variant="h5">normal</Typography>
          <RadioButton value="value" label="Radio button" checked={false} />
        </Box>

        <Box marginX={2}>
          <Typography variant="h5">checked</Typography>
          <RadioButton value="value" label="Radio button" checked />
        </Box>
      </Box>
    </Box>
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  text: 'Withdraw',
  disabled: false,
}
