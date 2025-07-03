import React from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Story } from '@storybook/react'

export default {
  title: 'Components/Typography',
  description: '',
}

const tokens = [
  {
    id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    name: 'dai',
    decimals: 18,
    symbol: 'dai',
  },
  {
    id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    name: 'usdc',
    decimals: 6,
    symbol: 'usdc',
  },
]

const Template: Story = () => {
  return (
    <Paper sx={{ m: 3, p: 3 }}>
      <Box display="flex" gap={5}>
        <Box ml={5}>
          <Typography variant="h1">H1 Text</Typography>
          <Typography variant="h2">H2 Text</Typography>
          <Typography variant="h3">H3 Text</Typography>
          <Typography variant="h4">H4 Text</Typography>
          <Typography variant="h5">H5 Text</Typography>
          <Typography variant="h6">H6 Text</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1">Subtitle 1</Typography>
          <Typography variant="subtitle2">Subtitle 2</Typography>
        </Box>
        <Box>
          <Typography variant="body1">Body 1</Typography>
          <Typography variant="body2">Body 2 </Typography>
        </Box>
        <Box display="flex" flexDirection="column">
          <Typography variant="button">Button</Typography>
          <Typography variant="caption">Caption</Typography>
          <Typography variant="overline">Overline</Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  token: tokens[0],
}
