import React from 'react'

import { Box, Paper, Typography } from '@mui/material'
import { Story } from '@storybook/react'

export default {
  title: 'Components/Paper',
  description: '',
}

const Template: Story = () => {
  return (
    <Box display="flex" gap={2} justifyContent="center" mt={4}>
      <Paper elevation={1} sx={{ width: 300, height: 580 }}>
        <Typography sx={{ m: 2 }}>Elevation 1</Typography>
      </Paper>
      <Paper elevation={2} sx={{ width: 300, height: 580 }}>
        <Typography sx={{ m: 2 }}> Elevation 2</Typography>
      </Paper>
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {}
