import React, { ComponentProps } from 'react'

import { Switch, CkbIcon } from '@hadouken-project/ui'
import { Story } from '@storybook/react/types-6-0'
import { CreateButtons, createIconCell } from '@utils/table'

import UserDepositCard from './UserDepositCard.component'

export default {
  title: 'Components/Cards/UserDepositCard',
  description: '',
  component: UserDepositCard,
}

const Template: Story<ComponentProps<typeof UserDepositCard>> = (args) => (
  <UserDepositCard {...args} />
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
        value: 1120,
        sortingValue: 1120,
      },
      APY: { value: '9.35%' },
      collateral: {
        value: <Switch key="test" defaultChecked size="small" disabled />,
      },
      button: {
        value: CreateButtons(
          { text: 'Deposit', onClick: (): null => null },
          { text: 'Withdraw', onClick: (): null => null },
        ),
      },
    },
  },
}
