import React from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Story } from '@storybook/react/types-6-0'

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
    <Paper>
      <Box display="flex">
        <Box>
          <Typography variant="h1">H1 Text</Typography>
          <Typography variant="h2">H2 Text</Typography>
          <Typography variant="h3">H3 Text</Typography>
          <Typography variant="h4Regular">H4 Regular Text</Typography>
          <Typography variant="h4Bold">H4 Bold Text</Typography>
          <Typography variant="h5">H5 Text</Typography>
        </Box>
        <Box ml={4}>
          <Typography variant="paragraphBig">Paragraph Big</Typography>
          <Typography variant="paragraphMedium">Paragraph Medium</Typography>
          <Typography variant="paragraphSmall">Paragraph Small</Typography>
          <Typography variant="paragraphTiny">Paragraph Tiny</Typography>
        </Box>
        <Box ml={4}>
          <Typography variant="buttonBig">Button Big</Typography>
          <Typography variant="buttonMedium">Button Medium</Typography>
          <Typography variant="buttonSmall">Button Small</Typography>

          <Typography variant="caption">caption</Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  token: tokens[0],
}
