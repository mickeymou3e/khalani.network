import { IColumn } from '@tvl-labs/khalani-ui'
import { ESortOrder } from '@tvl-labs/khalani-ui/dist/components/TableArchived/Table.types'

export const columns = [
  {
    name: 'sourceToDestinationChain',
    align: 'left',
  },
  {
    name: 'tokenWithAmount',
    align: 'left',
    sortOrder: ESortOrder.ASC,
    sortDefault: true,
  },
  {
    name: 'status',
    align: 'right',
    sortOrder: ESortOrder.DESC,
  },
] as IColumn[]
