import React, { ComponentProps, useState } from 'react'

import { UsdcIcon } from '@components/icons'
import { Box, ListItemButton, Paper, Skeleton, Typography } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import SearchList from './SearchList.component'
import { messages } from './SearchList.messages'
import { IListItem } from './SearchList.types'

export default {
  title: 'Components/Search/SearchList',
  description: '',
  component: SearchList,
}

const Template: Story<ComponentProps<typeof SearchList>> = (args) => {
  const [token, setToken] = useState(args.items[0])
  const handleTokenSelect = (item: IListItem) => {
    const selectedToken = args.items.find(
      (selectedToken) => selectedToken.id === item.id,
    )
    if (selectedToken) {
      setToken(selectedToken)
    }
  }

  return (
    <Paper sx={{ padding: 2 }}>
      <SearchList
        {...args}
        items={args.items.map((token) => ({
          id: token.id,
          text: token.text,
          description: token.text,
        }))}
        selectedItem={
          token && {
            id: token.id,
            text: token.text,
            description: token.text,
          }
        }
        onSelect={handleTokenSelect}
        itemRenderer={(item) => {
          const selectedToken = args.items.find(
            (selectedToken) => selectedToken.id === item.id,
          )
          const selected = token.id === selectedToken?.id

          return (
            <ListItemButton selected={selected}>
              <UsdcIcon style={{ height: 60, width: 60 }} />
              <Box
                width="100%"
                display="flex"
                justifyContent="space-between"
                marginX={0.5}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  marginRight={2}
                >
                  <Typography variant="h4Bold">
                    <b>{item.text}</b>
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="flex-end"
                  marginLeft={2}
                >
                  <Typography variant="caption">
                    {messages.BALANCE_LABEL}
                  </Typography>
                  <Typography variant="paragraphMedium">
                    <Skeleton width={50} />
                  </Typography>
                </Box>
              </Box>
            </ListItemButton>
          )
        }}
      />
    </Paper>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  items: [
    {
      id: '1',
      text: 'usdc',
      description: 'usdc',
    },
    {
      id: '2',
      text: 'dai',
      description: 'dai',
    },
  ],
}
