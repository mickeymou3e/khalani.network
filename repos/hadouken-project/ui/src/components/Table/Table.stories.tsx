import React, { ComponentProps, ReactElement } from 'react'

import { CkbIcon, DaiIcon, UsdcIcon, UsdtIcon } from '@components/icons/tokens'
import { Box, Button, Grid } from '@mui/material'
import { StoryObj } from '@storybook/react'

import Table from './Table.component'

const createIconCell = (icon: ReactElement, subtitle: string): ReactElement => (
  <Grid
    container
    direction="row"
    wrap="nowrap"
    key="icon"
    alignItems="center"
    gap="20px"
  >
    <Grid item display="inline-flex">
      {icon}
    </Grid>
    <Grid item>{subtitle}</Grid>
  </Grid>
)

export default {
  title: 'Components/Tables/Table',
  description: '',
  component: Table,
}

type Story = StoryObj<ComponentProps<typeof Table>>

const Template: Story = {
  render: (args) => (
    <Box p={20}>
      <Table {...args} />
    </Box>
  ),
}

export const Basic = { ...Template }
export const emptyBody = { ...Template }

Basic.args = {
  displayHeader: true,

  sortedColumnName: '1',
  sortDesc: true,
  columns: [
    {
      name: 'assets',
      value: 'Assets',
      width: '25%',
      align: 'left',
      isSortable: false,
    },
    {
      name: 'APY',
      value: 'APY',
      width: '10%',
      align: 'left',
      isSortable: false,
    },
    {
      name: 'LTV',
      value: 'LTV',
      width: '10%',
      align: 'left',
      isSortable: false,
    },
    {
      name: 'price',
      value: 'Asset price',
      width: '25%',
      align: 'left',
      isSortable: false,
    },
    {
      name: 'actions',
      value: 'Actions',
      width: '30%',
      align: 'left',
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
        APY: { value: '6.36%' },
        LTV: { value: '76%' },
        price: { value: '$ 282.99' },
        actions: {
          value: (
            <Box display="flex" justifyContent="center">
              <Button sx={{ width: '100%' }} size="small" variant="contained">
                Deposit
              </Button>
              <Button
                sx={{ ml: 2, width: '100%' }}
                size="small"
                variant="contained"
              >
                Withdraw
              </Button>
            </Box>
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
        APY: { value: '2.61%' },
        LTV: { value: '29%' },
        price: { value: '$ 2447.41' },
        actions: {
          value: (
            <Box display="flex" justifyContent="center">
              <Button sx={{ width: '100%' }} size="small" variant="contained">
                Deposit
              </Button>
              <Button
                sx={{ ml: 2, width: '100%' }}
                size="small"
                variant="contained"
              >
                Withdraw
              </Button>
            </Box>
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
        APY: { value: '9.35%' },
        LTV: { value: '12%' },
        price: { value: '$ 1.00' },
        actions: {
          value: (
            <Box display="flex" justifyContent="center">
              <Button sx={{ width: '100%' }} size="small" variant="contained">
                Deposit
              </Button>
              <Button
                sx={{ ml: 2, width: '100%' }}
                size="small"
                variant="contained"
              >
                Withdraw
              </Button>
            </Box>
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
        APY: { value: '9.35%' },
        LTV: { value: '12%' },
        price: { value: '$ 1.00' },
        actions: {
          value: (
            <Box display="flex" justifyContent="center">
              <Button sx={{ width: '100%' }} size="small" variant="contained">
                Deposit
              </Button>
              <Button
                sx={{ ml: 2, width: '100%' }}
                size="small"
                variant="contained"
              >
                Withdraw
              </Button>
            </Box>
          ),
        },
      },
    },
  ],
}

emptyBody.args = {
  displayHeader: true,

  sortedColumnName: '1',
  sortDesc: true,
  columns: [
    {
      name: 'assets',
      value: 'Assets',
      width: '25%',
      align: 'left',
      isSortable: false,
    },
    {
      name: 'APY',
      value: 'APY',
      width: '25%',
      align: 'right',
      isSortable: false,
    },
    {
      name: 'LTV',
      value: 'LTV',
      width: '25%',
      align: 'right',
      isSortable: false,
    },
    {
      name: 'price',
      value: 'Asset price',
      width: '25%',
      align: 'right',
      isSortable: false,
    },
  ],
}
