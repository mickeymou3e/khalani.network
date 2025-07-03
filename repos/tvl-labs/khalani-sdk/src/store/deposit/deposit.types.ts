export interface IDepositSliceState {
  loading: boolean
  initialized: boolean
  error: string | null
  params: DepositParams | null
}

export type DepositParams = { srcAddress: string; srcAmount: bigint }
