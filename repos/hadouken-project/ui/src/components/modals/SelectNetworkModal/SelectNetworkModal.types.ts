import { IModal } from '@interfaces/core'

export type Network = {
  name: string
  chainId: number
}

export interface ISelectNetworkModalProps extends IModal {
  networks: Network[]
  currentNetwork?: number
  onSelect?: (chainId: number) => void
  shouldBeAlwaysOpen: boolean
}
