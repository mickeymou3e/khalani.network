import { IColumn } from '@tvl-labs/khalani-ui'
import { ESortOrder } from '@tvl-labs/khalani-ui/dist/components/TableArchived/Table.types'

export const liquidityColumns = [
  {
    name: 'tokenSymbol',
    value: 'Assets',
    width: '15%',
    align: 'left',
  },
  {
    name: 'chain',
    value: 'Chain',
    width: '23%',
    align: 'left',
    sortOrder: ESortOrder.ASC,
    sortDefault: true,
  },
  {
    name: 'balance',
    value: 'Balance',
    width: '12%',
    align: 'left',
    sortOrder: ESortOrder.ASC,
    sortDefault: true,
  },
  {
    name: 'targetConstraints',
    value: 'Constraints',
    width: '15%',
    align: 'left',
    sortOrder: ESortOrder.DESC,
  },
  {
    name: 'fee',
    value: 'Fees',
    width: '5%',
    align: 'left',
    sortOrder: ESortOrder.DESC,
  },
  {
    name: 'action',
    value: '',
    width: '30%',
    align: 'left',
    sortOrder: ESortOrder.DESC,
  },
] as IColumn[]
