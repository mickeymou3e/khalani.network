import React, { ComponentProps, useState } from 'react'

import { Paper, Typography } from '@mui/material'
import { StoryObj } from '@storybook/react'

import NetworkSelectorBox from './NetworkSelectorBox/NetworkSelectorBox.component'
import Selector from './Selector.component'

export default {
  title: 'Components/Buttons/Selector',
  description: '',
  component: Selector,
}

const bridgeItems = [
  {
    id: '1',
    from: 'Ethereum',
    to: 'Godwoken',
    name: 'Force Bridge Ethereum',
  },
  {
    id: '2',
    from: 'BSC',
    to: 'Godwoken',
    name: 'Force Bridge BSC',
  },
  {
    id: '3',
    from: 'CKB',
    to: 'Godwoken',
    name: 'Omni Bridge',
  },
]

type Story = StoryObj<ComponentProps<typeof Selector>>

const Template: Story = {
  render: () => {
    const [items] = useState(
      bridgeItems.map((x) => ({ name: x.name, id: x.id })),
    )
    const [item, setItem] = useState(items[0])

    return (
      <Paper>
        <Selector
          items={bridgeItems}
          selectedItem={item}
          onSelect={(item) => setItem(item)}
          itemRenderer={(modalItem) => {
            const currentItem = bridgeItems.find((x) => x.id === modalItem.id)
            const selected = modalItem.id === item?.id

            return (
              <NetworkSelectorBox
                from={currentItem?.from ?? ''}
                to={currentItem?.to ?? ''}
                selected={selected}
                description={modalItem.name}
              />
            )
          }}
          title={''}
        >
          <Typography>{item.name}</Typography>
        </Selector>
      </Paper>
    )
  },
}

export const Basic = { ...Template }
