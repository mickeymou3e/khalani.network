import { IOperation } from '@interfaces/core'

export type IHistoryItemProps = Pick<
  IOperation,
  'status' | 'description' | 'title'
>
