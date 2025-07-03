import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { Network } from '@constants/Networks'
import { chainsSelectors } from '@store/chains/chains.selector'
import { khalaBalancesSelectors } from '@store/khala/balances/balances.selector'
import { khalaTokenSelectors } from '@store/khala/tokens/tokens.selector'
import { ITokenModelBalanceWithChain } from '@store/khala/tokens/tokens.types'
import { findPANToken, findUSDCToken } from '@utils/token'

import { IUseChainsHook, IUseTokenWithBalanceHook } from './MintContainer.types'

export const useTokenWithBalances = (): IUseTokenWithBalanceHook => {
  const [selectedToken, setSelectedToken] = useState<
    ITokenModelBalanceWithChain | undefined
  >(undefined)
  const [selectedTokenValue, setSelectedTokenValue] = useState<
    BigNumber | undefined
  >()

  const [destinationToken, setDestinationToken] = useState<
    ITokenModelBalanceWithChain | undefined
  >(undefined)

  const [destinationTokenValue, setDestinationTokenValue] = useState<
    BigNumber | undefined
  >()

  const allTokens = useSelector(khalaTokenSelectors.selectAll)
  const selectBalanceById = useSelector(khalaBalancesSelectors.selectById)

  useEffect(() => {
    const ethTokens = allTokens.filter(
      (token) => token.chainId === Network.Goerli,
    )
    const usdcToken = findUSDCToken(ethTokens) as ITokenModelBalanceWithChain
    const panToken = findPANToken(ethTokens) as ITokenModelBalanceWithChain

    if (usdcToken) {
      const usdcBalance = selectBalanceById(usdcToken.id)

      setSelectedToken({
        ...usdcToken,
        balance: usdcBalance?.balance || BigNumber.from(0),
      })
      setDestinationToken({ ...panToken })
    }
  }, [allTokens, selectBalanceById])

  return {
    selectedTokenValue,
    setSelectedTokenValue,
    selectedToken,
    destinationToken,
    destinationTokenValue,
    setDestinationTokenValue,
  }
}

export const useChains = (): IUseChainsHook => {
  const chains = useSelector(chainsSelectors.chains)

  const ethChain = useMemo(() => {
    return chains.find((chain) => chain.chainId === Network.Goerli)
  }, [chains])

  return {
    ethChain,
  }
}
