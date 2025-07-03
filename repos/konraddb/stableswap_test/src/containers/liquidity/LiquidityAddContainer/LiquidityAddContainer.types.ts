import { Dispatch, SetStateAction } from 'react'

import { BigNumber } from 'ethers'

import { TokenModel } from '@hadouken-project/ui'
import { IToken, ITokenWithBalance } from '@interfaces/token'
import { IChain } from '@store/chains/chains.types'
import { BigDecimal } from '@utils/math'

export interface IPoolTokensHook {
  baseTokenValue: BigNumber | undefined
  setBaseTokenValue: Dispatch<SetStateAction<BigNumber | undefined>>
  baseTokenMaxAmount: BigNumber | undefined
  additionalToken: TokenModel | undefined
  additionalTokenMaxAmount: BigNumber | undefined
  additionalTokenValue: BigNumber | undefined
  setAdditionalTokenValue: Dispatch<SetStateAction<BigNumber | undefined>>
  baseToken: TokenModel | undefined
  poolBalancesWithSymbol: IPoolBalancesWithSymbol[]
  expectedChain: IChain | undefined
  depositTokens: ITokenWithBalance[] | undefined
  poolId: string | undefined
}

export interface IAddLiquidityRequest {
  inTokens: IToken['address'][]
  inTokensAmounts: BigNumber[]
}

export interface IPoolBalancesWithSymbol {
  balance: BigDecimal | null | undefined
  symbol: string
}
