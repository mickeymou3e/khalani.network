export interface IExternalLinkProps {
  destination: string
  hash: string
  type: ExplorerLinkType
  fill?: string
  width?: number
  height?: number
}

export type ExplorerLinkType = 'tx' | 'address' | 'block' | 'token' | 'account'
