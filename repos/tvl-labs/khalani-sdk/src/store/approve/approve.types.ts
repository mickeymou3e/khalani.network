import { Address } from '@store/tokens/tokens.types'

export interface IApproveSliceState {
  loading: boolean
  approvalTokens: IApprovalToken[]
  error?: string
}

export interface IApprovalToken {
  address: Address
  symbol: string
  amount: bigint
  decimals: number
  spender: Address
  owner: Address
}
