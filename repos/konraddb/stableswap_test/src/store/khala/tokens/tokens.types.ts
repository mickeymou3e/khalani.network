import { Network } from '@constants/Networks'
import { TokenModelBalanceWithIcon } from '@hadouken-project/ui'
import { IInitializeSaga } from '@interfaces/data'
import { IToken } from '@interfaces/token'
import { IChain } from '@store/chains/chains.types'

export type IKhalaTokensSagaState = IInitializeSaga & { isFetching: boolean }

export type ITokenWithChainId = IToken & {
  chainId: Network
}

export type ITokenOnlyAddressAndChain = Pick<
  ITokenWithChainId,
  'address' | 'chainId'
>

export interface ITokenModelBalanceWithChain extends TokenModelBalanceWithIcon {
  chainId: IChain['chainId']
}
