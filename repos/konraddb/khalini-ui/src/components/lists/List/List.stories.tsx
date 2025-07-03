import React, { ComponentProps } from 'react'

import { UsdtIcon } from '@components/icons'
import { List, ListItem, Paper, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import DefaultListItem from './List.component'

export default {
  title: 'Components/lists/List',
  description: '',
  component: DefaultListItem,
}

const Template: Story<ComponentProps<typeof DefaultListItem>> = () => {
  const tokens = [
    { id: 1, name: 'USDT', desc: 'Tether' },
    { id: 2, name: 'USDT', desc: 'Tether' },
  ]
  return (
    <>
      <Box my={1}>
        <Paper>
          <List>
            <DefaultListItem text="USDT" description="Tether" />
          </List>
        </Paper>
      </Box>
      <Paper>
        <List>
          {tokens.map((item) => (
            <Box key={item.id} pt={1}>
              <ListItem>
                <UsdtIcon style={{ height: 50, width: 50 }} />
                <Box ml={2}>
                  <Typography>{item.name}</Typography>
                  <Typography>{item.desc}</Typography>
                </Box>
              </ListItem>
            </Box>
          ))}
        </List>
      </Paper>
    </>
  )
}

export const Basic = Template.bind({})

Basic.args = {}
