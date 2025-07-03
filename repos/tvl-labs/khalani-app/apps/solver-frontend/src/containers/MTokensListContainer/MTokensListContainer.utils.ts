import { IColumn } from '@tvl-labs/khalani-ui'
import { ESortOrder } from '@tvl-labs/khalani-ui/dist/components/TableArchived/Table.types'

export const mTokenColumns = [
  {
    name: 'tokenSymbol',
    value: 'Assets',
    width: '15%',
    align: 'left',
  },
  {
    name: 'chain',
    value: 'Chain',
    width: '25%',
    align: 'left',
    sortOrder: ESortOrder.ASC,
    sortDefault: true,
  },
  {
    name: 'provider',
    value: 'Provider',
    width: '15%',
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
    name: 'action',
    value: '',
    width: '33%',
    align: 'left',
    sortOrder: ESortOrder.DESC,
  },
] as IColumn[]
