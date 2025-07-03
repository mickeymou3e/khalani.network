import React from 'react'

import { TableCellProps } from '@mui/material/TableCell'
import { fireEvent, render, screen } from '@testing-library/react'

import Table from './Table.component'
import { ESortOrder, IRow } from './Table.types'
import TableHead from './TableHead.component'

const columns = [
  {
    name: 'token',
    value: 'Token',
    width: '25%',
    align: 'right' as TableCellProps['align'],
  },
  {
    name: 'network',
    value: 'Network',
    width: '25%',
    align: 'left' as TableCellProps['align'],
    sortOrder: ESortOrder.ASC,
  },
  {
    name: 'LTV',
    value: 'LTV',
    width: '25%',
    align: 'right' as TableCellProps['align'],
    sortOrder: ESortOrder.ASC,
  },
  {
    name: 'price',
    value: 'Asset price',
    width: '25%',
    align: 'right' as TableCellProps['align'],
    sortOrder: ESortOrder.ASC,
  },
]

const rows: IRow[] = [
  {
    id: 'Bitcoin',
    cells: {
      network: { value: 'Bitcoin' },
      token: { value: '4.03%', sortingValue: '4.03' },
      LTV: { value: '75%' },
      price: { value: '$ 33447.41', sortingValue: '33447.41' },
    },
  },
  {
    id: 'Ethereum',
    cells: {
      network: { value: 'Ethereum' },
      token: { value: '7.99%', sortingValue: '7.99' },
      LTV: { value: '23%' },
      price: { value: '$ 2107.76', sortingValue: '2107.76' },
    },
  },
  {
    id: 'BNB',
    cells: {
      network: { value: 'BNB' },
      token: { value: '6.36%', sortingValue: '6.36' },
      LTV: { value: '76%' },
      price: { value: '$ 282.99', sortingValue: '282.99' },
    },
  },
  {
    id: 'Cardano',
    cells: {
      network: { value: 'Cardano' },
      token: { value: '2.61%', sortingValue: '2.61' },
      LTV: { value: '29%' },
      price: { value: '$ 2447.41', sortingValue: '2447.41' },
    },
  },
  {
    id: 'TetherUS',
    cells: {
      network: { value: 'TetherUS' },
      token: { value: '9.35%', sortingValue: '9.35' },
      LTV: { value: '12%' },
      price: { value: '$ 1.00', sortingValue: '1' },
    },
  },
]

describe('Table component', () => {
  it('display correctly', () => {
    render(<Table rows={rows} columns={columns} />)
    expect(screen.getByText('Network')).toBeInTheDocument()
  })
  it('should render 6 rows', () => {
    render(<Table rows={rows} columns={columns} />)
    expect(screen.getAllByRole('row').length).toBe(6)
  })
  it('should hide header row', () => {
    render(<Table rows={rows} columns={columns} displayHeader={false} />)
    expect(screen.getAllByRole('row').length).toBe(5)
  })
  it('should not call onSortColumn function', async () => {
    const onSortColumn = jest.fn()

    render(<TableHead columns={columns} onSortColumn={onSortColumn} />)

    const tokenHeader = screen.getByText('Token')
    expect(tokenHeader).toBeInTheDocument()

    fireEvent.click(tokenHeader)
    expect(onSortColumn).toBeCalledTimes(0)
  })

  it('should call onSortColumn function with correct parameters', async () => {
    const onSortColumn = jest.fn()

    render(<TableHead columns={columns} onSortColumn={onSortColumn} />)

    const networkHeader = screen.getByText('Network')
    expect(networkHeader).toBeInTheDocument()

    fireEvent.click(networkHeader)
    expect(onSortColumn).toHaveBeenCalledTimes(1)
    expect(onSortColumn).toHaveBeenCalledWith('network', ESortOrder.DESC)

    fireEvent.click(networkHeader)
    expect(onSortColumn).toHaveBeenCalledTimes(2)
    expect(onSortColumn).toHaveBeenCalledWith('network', ESortOrder.ASC)

    fireEvent.click(networkHeader)
    expect(onSortColumn).toHaveBeenCalledTimes(3)
    expect(onSortColumn).toHaveBeenCalledWith('network', ESortOrder.DESC)
  })
  it('should display spinner and `fetching` label', () => {
    render(
      <Table
        rows={[]}
        columns={columns}
        displayHeader={false}
        isLoading={true}
      />,
    )
    expect(screen.getByText('Loading...')).toBeVisible()
  })
  it('should display `no data` label', () => {
    render(
      <Table
        rows={[]}
        columns={columns}
        displayHeader={false}
        isLoading={false}
      />,
    )
    expect(screen.getByText('No data')).toBeVisible()
  })
})
