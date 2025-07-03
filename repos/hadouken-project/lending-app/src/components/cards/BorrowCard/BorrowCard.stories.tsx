import React, { ComponentProps } from 'react'

import { CkbIcon } from '@hadouken-project/ui'
import { Story } from '@storybook/react/types-6-0'
import { createIconCell } from '@utils/table'

import BorrowCard from './BorrowCard.component'

export default {
  title: 'Components/Cards/BorrowCard',
  description: '',
  component: BorrowCard,
}

const Template: Story<ComponentProps<typeof BorrowCard>> = (args) => (
  <BorrowCard {...args} />
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
        value: 1200,
        sortingValue: 1200,
      },
      StableAPY: {
        value: '4.03%',
      },
      VariableAPY: {
        value: '6.03%',
      },
    },
  },
}
