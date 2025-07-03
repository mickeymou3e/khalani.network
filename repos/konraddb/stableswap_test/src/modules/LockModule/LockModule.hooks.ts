import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { chainsSelectors } from '@store/chains/chains.selector'
import { IChain } from '@store/chains/chains.types'
import { khalaBalancesSelectors } from '@store/khala/balances/balances.selector'
import { khalaTokenSelectors } from '@store/khala/tokens/tokens.selector'
import { ITokenModelBalanceWithChain } from '@store/khala/tokens/tokens.types'
import { lockSelectors } from '@store/lock/lock.selector'
import { networkSelectors } from '@store/network/network.selector'
import { ConnectionStageStatus } from '@store/wallet/connection/types'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { IUseChainsHook, IUseTokenWithBalanceHook } from './LockModule.types'

export const useTokenWithBalances = (): IUseTokenWithBalanceHook => {
  const [selectableTokens, setSelectableTokens] = useState<
    ITokenModelBalanceWithChain[] | null
  >([])
  const [
    originToken,
    setOriginToken,
  ] = useState<ITokenModelBalanceWithChain | null>(null)
  const [destinationToken, setDestinationToken] = useState<
    ITokenModelBalanceWithChain | undefined
  >(undefined)

  const [selectedTokenValue, setSelectedTokenValue] = useState<
    BigNumber | undefined
  >()

  const [destinationTokenValue, setDestinationTokenValue] = useState<
    BigNumber | undefined
  >()

  const currentChainTokens = useSelector(
    khalaTokenSelectors.selectByCurrentNetwork,
  )
  const allTokens = useSelector(khalaTokenSelectors.selectAll)

  const onlyChainIdWithTokens = useSelector(
    khalaBalancesSelectors.onlyChainIdWithTokens,
  )
  const selectBalanceById = useSelector(khalaBalancesSelectors.selectById)

  useEffect(() => {
    const tokensWithBalances = currentChainTokens.map((token) => {
      const foundBalance = selectBalanceById(token.id)
      return {
        ...token,
        balance: foundBalance?.balance || BigNumber.from(0),
      }
    })
    setSelectableTokens(tokensWithBalances)
  }, [currentChainTokens, selectBalanceById])

  return {
    allTokens,
    onlyChainIdWithTokens,
    selectableTokens,
    selectedTokenValue,
    setSelectedTokenValue,
    originToken,
    setOriginToken,
    destinationToken,
    setDestinationToken,
    destinationTokenValue,
    setDestinationTokenValue,
  }
}

export const useChains = (): IUseChainsHook => {
  const [originChain, setOriginChain] = useState<IChain | null>(null)
  const [availableOriginChains, setAvailableOriginChains] = useState<
    IChain[] | null
  >(null)
  const [destinationChain, setDestinationChain] = useState<IChain | null>(null)
  const [availableDesinationChains, setDesinationOriginChains] = useState<
    IChain[] | null
  >(null)

  const chains = useSelector(chainsSelectors.chains)
  const currentChainId = useSelector(networkSelectors.network)
  const destinationChainId = useSelector(lockSelectors.destinationChain)
  const connectionStage = useSelector(walletSelectors.connectionStage)

  useEffect(() => {
    if (
      destinationChainId &&
      connectionStage.status === ConnectionStageStatus.Success
    ) {
      const specifiedChain = chains?.find(
        (chain) => chain.chainId === destinationChainId,
      )
      if (specifiedChain) {
        setDestinationChain(specifiedChain)
      }
    }
    if (!destinationChainId) {
      setDestinationChain(
        chains.filter((chain) => chain.chainId !== currentChainId)[0],
      )
    }
  }, [chains, destinationChainId, currentChainId, connectionStage])

  useEffect(() => {
    const specifiedChain = chains?.find(
      (chain) => chain.chainId === currentChainId,
    )
    if (specifiedChain && chains) {
      setOriginChain(specifiedChain)
    }
  }, [chains, currentChainId])

  useEffect(() => {
    if (originChain && destinationChain) {
      const availableOriginChains = chains?.filter(
        (chain) => chain.chainId !== originChain.chainId,
      )
      const availableDestinationChains = chains?.filter(
        (chain) => chain.chainId !== destinationChain.chainId,
      )

      if (availableOriginChains && availableDestinationChains) {
        setAvailableOriginChains(availableOriginChains)
        setDesinationOriginChains(availableDestinationChains)
      }
    }
  }, [originChain, destinationChain, currentChainId, chains])

  return {
    chains,
    originChain,
    availableOriginChains,
    destinationChain,
    setDestinationChain,
    availableDesinationChains,
    setDesinationOriginChains,
  }
}
