import { ENetwork } from '@interfaces/core'

export interface ITokenWithNetwork {
  tokenSymbol: string
  chainId?: ENetwork
  tokenIconSize?: IIconSize
  networkIconSize?: IIconSize
  isStkToken?: boolean
  displayBackground?: boolean
}

interface IIconSize {
  width: number
  height: number
}
