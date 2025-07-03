import React, { ComponentProps } from 'react'

import BalanceCard from '@components/cards/BalanceCard'
import BorrowCard from '@components/cards/BorrowCard'
import UserDepositCard from '@components/cards/UserDepositCard'
import {
  Switch,
  CkbIcon,
  UsdtIcon,
  UsdcIcon,
  DaiIcon,
} from '@hadouken-project/ui'
import { Story } from '@storybook/react/types-6-0'
import { CreateButtons, createIconCell } from '@utils/table'

import CardList from './CardList.component'

export default {
  title: 'Components/Cards/CardList',
  description: '',
  component: CardList,
}

const Template: Story<ComponentProps<typeof CardList>> = (args) => (
  <CardList {...args} />
)

export const BalanceList = Template.bind({})
export const BorrowList = Template.bind({})
export const UserDepositList = Template.bind({})

BalanceList.args = {
  Component: BalanceCard,
  rows: [
    {
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
          value: '1.20k',
          sortingValue: 1200,
        },
        APY: {
          value: '4.03%',
        },
      },
    },

    {
      id: 'DAI',
      cells: {
        assets: {
          value: createIconCell(
            <DaiIcon style={{ height: 24, width: 24 }} />,
            'DAI',
          ),
          sortingValue: 'DAI',
        },
        balance: {
          value: '10.00k',
          sortingValue: 1000,
        },
        APY: { value: '7.99%' },
      },
    },

    {
      id: 'USDC',
      cells: {
        assets: {
          value: createIconCell(
            <UsdcIcon style={{ height: 24, width: 24 }} />,
            'USDC',
          ),
          sortingValue: 'USDC',
        },
        balance: {
          value: '300.00k',
          sortingValue: 3000,
        },
        APY: { value: '6.36%' },
      },
    },

    {
      id: 'USDT',
      cells: {
        assets: {
          value: createIconCell(
            <UsdtIcon style={{ height: 24, width: 24 }} />,
            'USDT',
          ),
          sortingValue: 'USDT',
        },
        balance: {
          value: '1.05m',
          sortingValue: 1500,
        },
        APY: { value: '2.61%' },
      },
    },
  ],
}

BorrowList.args = {
  Component: BorrowCard,
  rows: [
    {
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
          value: '1.20k',
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

    {
      id: 'DAI',
      cells: {
        assets: {
          value: createIconCell(
            <DaiIcon style={{ height: 24, width: 24 }} />,
            'DAI',
          ),
          sortingValue: 'DAI',
        },
        balance: {
          value: '10.00k',
          sortingValue: 1000,
        },
        StableAPY: { value: '7.99%' },
        VariableAPY: {
          value: '5.13%',
        },
      },
    },

    {
      id: 'USDC',
      cells: {
        assets: {
          value: createIconCell(
            <UsdcIcon style={{ height: 24, width: 24 }} />,
            'USDC',
          ),
          sortingValue: 'USDC',
        },
        balance: {
          value: '300.00k',
          sortingValue: 3000,
        },
        StableAPY: { value: '6.36%' },
        VariableAPY: {
          value: '2.69%',
        },
      },
    },

    {
      id: 'USDT',
      cells: {
        assets: {
          value: createIconCell(
            <UsdtIcon style={{ height: 24, width: 24 }} />,
            'USDT',
          ),
          sortingValue: 'USDT',
        },
        balance: {
          value: '1.05m',
          sortingValue: 1500,
        },
        StableAPY: { value: '2.61%' },
        VariableAPY: {
          value: '4.20%',
        },
      },
    },
  ],
}

UserDepositList.args = {
  Component: UserDepositCard,
  rows: [
    {
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
          value: '1.20k',
          sortingValue: 1200,
        },
        APY: {
          value: '4.03%',
        },
        collateral: {
          value: <Switch key="test" defaultChecked size="small" />,
        },
        button: {
          value: CreateButtons(
            { text: 'Deposit', onClick: (): null => null },
            { text: 'Withdraw', onClick: (): null => null },
          ),
        },
      },
    },

    {
      id: 'DAI',
      cells: {
        assets: {
          value: createIconCell(
            <DaiIcon style={{ height: 24, width: 24 }} />,
            'DAI',
          ),
          sortingValue: 'DAI',
        },
        balance: {
          value: '10.00k',
          sortingValue: 1000,
        },
        APY: { value: '7.99%' },
        collateral: {
          value: <Switch key="test" defaultChecked size="small" />,
        },
        button: {
          value: CreateButtons(
            { text: 'Deposit', onClick: (): null => null },
            { text: 'Withdraw', onClick: (): null => null },
          ),
        },
      },
    },

    {
      id: 'USDC',
      cells: {
        assets: {
          value: createIconCell(
            <UsdcIcon style={{ height: 24, width: 24 }} />,
            'USDC',
          ),
          sortingValue: 'USDC',
        },
        balance: {
          value: '300.00k',
          sortingValue: 3000,
        },
        APY: { value: '6.36%' },
        collateral: {
          value: <Switch key="test" defaultChecked size="small" />,
        },
        button: {
          value: CreateButtons(
            { text: 'Deposit', onClick: (): null => null },
            { text: 'Withdraw', onClick: (): null => null },
          ),
        },
      },
    },

    {
      id: 'TetherUS',
      cells: {
        assets: {
          value: createIconCell(
            <UsdtIcon style={{ height: 24, width: 24 }} />,
            'TetherUS',
          ),
          sortingValue: 'TetherUS',
        },
        balance: {
          value: '1.12k',
          sortingValue: 1120,
        },
        APY: { value: '9.35%' },
        collateral: {
          value: <Switch key="test" defaultChecked size="small" />,
        },
        button: {
          value: CreateButtons(
            { text: 'Deposit', onClick: (): null => null },
            { text: 'Withdraw', onClick: (): null => null },
          ),
        },
      },
    },
  ],
}
