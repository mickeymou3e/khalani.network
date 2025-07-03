import { address } from '@dataSource/graph/utils/formatters'
import { tokens as tokensConfig } from '@hadouken-project/config'
import {
  Environment as ZksyncEnvironment,
  tokens as zksyncTokensConfig,
} from '@hadouken-project/config-zksync'
import { isZkSyncNetwork } from '@hadouken-project/lending-contracts'
import { IToken } from '@interfaces/token'

import { env } from '../../../../utils/network'

export const getTokens = (chainId: string): IToken[] => {
  if (isZkSyncNetwork(chainId)) {
    return zksyncTokensConfig(env as ZksyncEnvironment).map((token) => ({
      ...token,
      id: token.address,
      displayName: token.symbol,
      address: address(token.address),
    }))
  } else {
    return tokensConfig(chainId).map((token) => ({
      ...token,
      id: token.address,
      displayName: token.symbol,
      address: address(token.address),
    }))
  }
}
