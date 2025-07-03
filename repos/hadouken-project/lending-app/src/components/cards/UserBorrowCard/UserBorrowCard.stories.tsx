import React, { ComponentProps } from 'react'

import { Switch, CkbIcon } from '@hadouken-project/ui'
import { Story } from '@storybook/react/types-6-0'
import { CreateButtons, createIconCell } from '@utils/table'

import UserBorrowCard from './UserBorrowCard.component'

export default {
  title: 'Components/Cards/UserBorrowCards',
  description: '',
  component: UserBorrowCard,
}

const Template: Story<ComponentProps<typeof UserBorrowCard>> = (args) => (
  <UserBorrowCard {...args} />
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
      borrowed: {
        value: 1500,
        sortingValue: 1500,
      },
      APY: { value: '2.61%' },
      APYType: {
        value: <Switch key="test" defaultChecked size="small" disabled />,
      },
      button: {
        value: CreateButtons(
          { text: 'Borrow', onClick: (): null => null },
          { text: 'Repay', onClick: (): null => null },
        ),
      },
    },
  },
}
