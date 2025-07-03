import React from 'react'

import { TableCellProps } from '@mui/material/TableCell'
import { fireEvent, render, screen } from '@testing-library/react'

import Table from './Table.component'
import { IRow } from './Table.types'

const columns = [
  {
    name: 'asset',
    value: 'Assets',
    width: '25%',
    align: 'left' as TableCellProps['align'],
    isSortable: true,
  },
  {
    name: 'APY',
    value: 'APY',
    width: '25%',
    align: 'right' as TableCellProps['align'],
    isSortable: true,
  },
  {
    name: 'LTV',
    value: 'LTV',
    width: '25%',
    align: 'right' as TableCellProps['align'],
    isSortable: false,
  },
  {
    name: 'price',
    value: 'Asset price',
    width: '25%',
    align: 'right' as TableCellProps['align'],
    isSortable: true,
  },
]

const rows: IRow[] = [
  {
    id: 'Bitcoin',
    cells: {
      asset: { value: 'Bitcoin' },
      APY: { value: '4.03%', sortingValue: '4.03' },
      LTV: { value: '75%' },
      price: { value: '$ 33447.41', sortingValue: '33447.41' },
    },
  },
  {
    id: 'Ethereum',
    cells: {
      asset: { value: 'Ethereum' },
      APY: { value: '7.99%', sortingValue: '7.99' },
      LTV: { value: '23%' },
      price: { value: '$ 2107.76', sortingValue: '2107.76' },
    },
  },
  {
    id: 'BNB',
    cells: {
      asset: { value: 'BNB' },
      APY: { value: '6.36%', sortingValue: '6.36' },
      LTV: { value: '76%' },
      price: { value: '$ 282.99', sortingValue: '282.99' },
    },
  },
  {
    id: 'Cardano',
    cells: {
      asset: { value: 'Cardano' },
      APY: { value: '2.61%', sortingValue: '2.61' },
      LTV: { value: '29%' },
      price: { value: '$ 2447.41', sortingValue: '2447.41' },
    },
  },
  {
    id: 'TetherUS',
    cells: {
      asset: { value: 'TetherUS' },
      APY: { value: '9.35%', sortingValue: '9.35' },
      LTV: { value: '12%' },
      price: { value: '$ 1.00', sortingValue: '1' },
    },
  },
]

describe('Table component', () => {
  it('display correctly', () => {
    render(<Table rows={rows} columns={columns} />)
    expect(screen.getByText('Assets')).toBeInTheDocument()
  })
  it('should render 6 rows', () => {
    render(<Table rows={rows} columns={columns} />)
    expect(screen.getAllByRole('row').length).toBe(6)
  })
  it('should hide header row', () => {
    render(<Table rows={rows} columns={columns} displayHeader={false} />)
    expect(screen.getAllByRole('row').length).toBe(5)
  })
  it('should not call onSortColumn or onSortDesc functions', async () => {
    let sortedColumnName: string | undefined
    let sortDesc: boolean | undefined
    const setSortedColumnName = jest.fn((value) => (sortedColumnName = value))
    const setSortDesc = jest.fn((value) => (sortDesc = value))
    render(
      <Table
        rows={rows}
        columns={columns}
        sortedColumnName={sortedColumnName}
        sortDesc={sortDesc}
        onSortColumn={setSortedColumnName}
        onSortDesc={setSortDesc}
      />,
    )
    const LTVHeader = screen.getByText('LTV')
    expect(LTVHeader).toBeInTheDocument()
    expect(setSortedColumnName).toBeCalledTimes(0)
    expect(setSortDesc).toBeCalledTimes(0)

    await fireEvent.click(LTVHeader)
  })
  it('should call onSortColumn and onSortDesc functions', async () => {
    let sortedColumnName: string | undefined
    let sortDesc: boolean | undefined
    const setSortedColumnName = jest.fn((value) => (sortedColumnName = value))
    const setSortDesc = jest.fn((value) => (sortDesc = value))
    const { rerender } = render(
      <Table
        rows={rows}
        columns={columns}
        sortedColumnName={sortedColumnName}
        sortDesc={sortDesc}
        onSortColumn={setSortedColumnName}
        onSortDesc={setSortDesc}
      />,
    )
    const priceHeader = screen.getByText('Asset price')
    expect(priceHeader).toBeInTheDocument()
    const assetHeader = screen.getByText('Assets')
    expect(assetHeader).toBeInTheDocument()

    await fireEvent.click(priceHeader)
    expect(setSortedColumnName).toHaveBeenCalledTimes(1)
    expect(setSortedColumnName).toHaveBeenCalledWith('price')
    expect(setSortDesc).toHaveBeenCalledTimes(1)
    expect(setSortDesc).toHaveBeenLastCalledWith(true)

    rerender(
      <Table
        rows={rows}
        columns={columns}
        sortedColumnName={sortedColumnName}
        sortDesc={sortDesc}
        onSortColumn={setSortedColumnName}
        onSortDesc={setSortDesc}
      />,
    )
    await fireEvent.click(priceHeader)
    expect(setSortDesc).toHaveBeenCalledTimes(2)
    expect(setSortDesc).toHaveBeenLastCalledWith(false)

    rerender(
      <Table
        rows={rows}
        columns={columns}
        sortedColumnName={sortedColumnName}
        sortDesc={sortDesc}
        onSortColumn={setSortedColumnName}
        onSortDesc={setSortDesc}
      />,
    )
    await fireEvent.click(priceHeader)
    expect(setSortDesc).toHaveBeenCalledTimes(3)
    expect(setSortDesc).toHaveBeenLastCalledWith(true)

    rerender(
      <Table
        rows={rows}
        columns={columns}
        sortedColumnName={sortedColumnName}
        sortDesc={sortDesc}
        onSortColumn={setSortedColumnName}
        onSortDesc={setSortDesc}
      />,
    )
    await fireEvent.click(priceHeader)
    expect(setSortDesc).toHaveBeenCalledTimes(4)
    expect(setSortDesc).toHaveBeenLastCalledWith(false)

    rerender(
      <Table
        rows={rows}
        columns={columns}
        sortedColumnName={sortedColumnName}
        sortDesc={sortDesc}
        onSortColumn={setSortedColumnName}
        onSortDesc={setSortDesc}
      />,
    )
    await fireEvent.click(assetHeader)
    expect(setSortedColumnName).toHaveBeenCalledTimes(2)
    expect(setSortedColumnName).toHaveBeenLastCalledWith('asset')
    expect(setSortDesc).toHaveBeenCalledTimes(5)
    expect(setSortDesc).toHaveBeenLastCalledWith(true)
  })
})
