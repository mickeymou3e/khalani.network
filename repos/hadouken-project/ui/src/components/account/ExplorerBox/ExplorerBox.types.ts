import { Explorer } from '@interfaces/core'

export interface IExplorerBoxProps {
  address: string | null
  networkName: string
  explorers: Explorer[]
}
