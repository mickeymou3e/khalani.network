import React, { ComponentProps } from 'react'

import { CkbIcon, DaiIcon, UsdcIcon, UsdtIcon } from '@components/icons/tokens'
import InfoIcon from '@mui/icons-material/Info'
import { IconButton, Tooltip, Typography } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import { Switch } from '../switch/Switch'
import SortableTable from './SortableTable.component'
import { CreateBalance, CreateButtons, createIconCell } from './Table.utils'

export default {
  title: 'Components/Tables/SortableTable',
  description: '',
  component: SortableTable,
}

const Template: Story<ComponentProps<typeof SortableTable>> = (args) => (
  <SortableTable {...args} />
)

export const TableWithSorting = Template.bind({})

TableWithSorting.args = {
  columns: [
    {
      name: 'assets',
      value: <Typography sx={{ fontWeight: 'bold' }}>Your deposits</Typography>,
      width: '15%',
      align: 'left',
      isSortable: true,
    },
    {
      name: 'balance',
      value: 'Current balance',
      width: '25%',
      align: 'center',
      isSortable: false,
    },
    {
      name: 'APY',
      value: 'APY',
      width: '20%',
      align: 'center',
      isSortable: false,
    },
    {
      name: 'collateral',
      value: (
        <div>
          Collateral
          <Tooltip
            title="Collateral"
            placement="top"
            style={{ padding: '14px' }}
          >
            <IconButton>
              <InfoIcon style={{ height: '16px', width: '16px' }} />
            </IconButton>
          </Tooltip>
        </div>
      ),
      width: '15%',
      align: 'center',
      isSortable: false,
    },
    {
      name: 'button',
      value: '',
      width: '25%',
      align: 'center',
      isSortable: false,
    },
  ],

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
          value: CreateBalance(1200, 1700),
          sortingValue: 1200,
        },
        APY: {
          value: '4.03%',
        },
        collateral: {
          value: <Switch key="test" defaultChecked size="small" disabled />,
        },
        button: {
          value: CreateButtons(
            { text: 'Deposit', onClick: () => null },
            { text: 'Withdraw', onClick: () => null },
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
          value: CreateBalance(10000, 1900),
          sortingValue: 1000,
        },
        APY: { value: '7.99%' },
        collateral: {
          value: <Switch key="test" defaultChecked size="small" disabled />,
        },
        button: {
          value: CreateButtons(
            { text: 'Deposit', onClick: () => null },
            { text: 'Withdraw', onClick: () => null },
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
          value: CreateBalance(300000, 3600),
          sortingValue: 3000,
        },
        APY: { value: '6.36%' },
        collateral: {
          value: <Switch key="test" defaultChecked size="small" disabled />,
        },
        button: {
          value: CreateButtons(
            { text: 'Deposit', onClick: () => null },
            { text: 'Withdraw', onClick: () => null },
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
          value: CreateBalance(112, 1235),
          sortingValue: 1120,
        },
        APY: { value: '9.35%' },
        collateral: {
          value: <Switch key="test" defaultChecked size="small" disabled />,
        },
        button: {
          value: CreateButtons(
            { text: 'Deposit', onClick: () => null },
            { text: 'Withdraw', onClick: () => null },
          ),
        },
      },
    },
  ],
}
