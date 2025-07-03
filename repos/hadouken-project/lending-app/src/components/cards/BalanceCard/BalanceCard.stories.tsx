import React, { ComponentProps } from 'react'

import { CkbIcon } from '@hadouken-project/ui'
import { Story } from '@storybook/react/types-6-0'
import { createIconCell } from '@utils/table'

import BalanceCard from './BalanceCard.component'

export default {
  title: 'Components/Cards/BalanceCard',
  description: '',
  component: BalanceCard,
}

const Template: Story<ComponentProps<typeof BalanceCard>> = (args) => (
  <BalanceCard {...args} />
)

export const Basic = Template.bind({})

Basic.args = {
  row: {
    id: 'CKB',
    cells: {
      assets: {
        value: createIconCell(
          <CkbIcon style={{ height: 24, width: 24 }} />,
          'CKB',
        ),
        sortingValue: 'CKB',
      },
      balance: {
        value: '12.5k',
        sortingValue: 12500,
      },
      APY: {
        value: '4.03%',
      },
    },
  },
}
