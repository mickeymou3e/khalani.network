import { Dispatch, SetStateAction } from 'react'

import { BigNumber } from 'ethers'

import { IToken, ITokenWithBalance } from '@interfaces/token'

export interface IProportionalSuggestionProps {
  baseToken: IToken | undefined
  baseTokenValue: BigNumber
  depositTokens: ITokenWithBalance[] | undefined
  setAdditionalTokenValue: Dispatch<SetStateAction<BigNumber | undefined>>
}
