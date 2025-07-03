import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useWallet, DEFAULT_NETWORK } from '@shared/store'
import { formatEthAddress, sortDescendingBigNumberValues } from '@shared/utils'
import { StoreDispatch } from '@store/store.types'
import { ITokenSelectorBalance, Typography } from '@tvl-labs/khalani-ui'
import {
  balancesSelectors,
  chainsSelectors,
  createRefineActions,
  createRefineSelectors,
  formatTokenSymbol,
  IChain,
  KHALA_SYMBOL,
  Network,
  queryRefineActions,
  QueryRefineErrors,
  queryRefineSelectors,
  TokenModelBalanceWithChain,
  tokenSelectors,
} from '@tvl-labs/sdk'

import { RefinementStatus } from '../../enums/Refinement.enum'
import {
  IUseChainsHook,
  IUseTokenWithBalanceHook,
  IUseTransactionSummary,
} from './BridgeModule.types'
import { filterBusdTokens } from './BridgeModule.utils'

export const useTokenWithBalances = (
  originNetwork: Network | undefined,
  destinationNetwork: Network,
): IUseTokenWithBalanceHook => {
  const [originToken, setOriginToken] = useState<
    TokenModelBalanceWithChain | undefined
  >()
  const [originTokenBalance, setOriginTokenBalance] = useState<
    bigint | undefined
  >(undefined)
  const [destinationTokenBalance, setDestinationTokenBalance] = useState<
    bigint | undefined
  >(undefined)
  const [destinationToken, setDestinationToken] = useState<
    TokenModelBalanceWithChain | undefined
  >(undefined)

  const [selectedTokenValue, setSelectedTokenValue] = useState<
    bigint | undefined
  >()

  const [destinationTokenValue, setDestinationTokenValue] = useState<
    bigint | undefined
  >()

  const selectByNetwork = useSelector(tokenSelectors.selectByNetwork)
  const allOriginTokens = useMemo(() => {
    if (!originNetwork) return []
    return selectByNetwork(originNetwork).filter(
      (token) => token.symbol !== KHALA_SYMBOL,
    )
  }, [originNetwork, selectByNetwork])
  const allDestinationTokens = useMemo(
    () =>
      selectByNetwork(destinationNetwork).filter(
        (token) => token.symbol !== KHALA_SYMBOL,
      ),
    [destinationNetwork, selectByNetwork],
  )

  const selectBalanceById = useSelector(balancesSelectors.selectById)

  const { tokenBalances } = useTokenBalances()

  useEffect(() => {
    if (selectedTokenValue) {
      setDestinationTokenValue(selectedTokenValue)
    } else {
      setDestinationTokenValue(undefined)
    }
  }, [selectedTokenValue, originToken])

  useEffect(() => {
    const foundBalance = selectBalanceById(originToken?.id ?? '')
    setOriginTokenBalance(foundBalance?.balance)
  }, [selectBalanceById, originToken?.id])

  useEffect(() => {
    const foundBalance = selectBalanceById(destinationToken?.id ?? '')
    setDestinationTokenBalance(foundBalance?.balance)
  }, [selectBalanceById, destinationToken?.id])

  const availableOriginTokens = useMemo(() => {
    const filteredTokens = allOriginTokens.filter((originToken) =>
      allDestinationTokens.find(
        (destinationToken) =>
          formatTokenSymbol(destinationToken.symbol) ===
          formatTokenSymbol(originToken.symbol),
      ),
    )
    return filteredTokens
  }, [allOriginTokens, allDestinationTokens])

  const availableDestinationTokens = useMemo(
    () => filterBusdTokens(allDestinationTokens, originToken),
    [allDestinationTokens, originToken],
  )

  useEffect(() => {
    if (availableOriginTokens && availableOriginTokens.length > 0) {
      setOriginToken(availableOriginTokens[0])
    } else {
      setOriginToken(undefined)
    }
  }, [availableOriginTokens, setOriginToken])

  useEffect(() => {
    if (!originToken) return
    if (availableDestinationTokens && availableDestinationTokens.length > 0) {
      setDestinationToken(
        availableDestinationTokens.find(
          (destToken) =>
            formatTokenSymbol(destToken.symbol) ===
            formatTokenSymbol(originToken.symbol),
        ),
      )
    }
  }, [availableDestinationTokens, originToken])

  return {
    selectableTokens: availableOriginTokens,
    selectedTokenValue,
    setSelectedTokenValue,

    originToken,
    setOriginToken,
    originTokenBalance,

    selectableDestinationTokens: availableDestinationTokens,
    destinationToken,
    destinationTokenBalance,

    setDestinationToken,
    destinationTokenValue,
    setDestinationTokenValue,
  }
}

export const useChains = (): IUseChainsHook => {
  const wallet = useWallet()
  const currentNetwork = wallet.network
  const nonKhalaniChains = useSelector(
    chainsSelectors.chainsWithoutBalancerChain,
  )

  const [originNetwork, setOriginNetwork] = useState(
    currentNetwork ?? DEFAULT_NETWORK,
  )
  const [destinationNetwork, setDestinatioNetwork] = useState<string>()

  useEffect(() => {
    // Subscribe to the explicit network changes and update the bridge plan.
    if (currentNetwork) {
      setOriginNetwork(currentNetwork)
    }
  }, [currentNetwork])

  const originChain = useMemo(() => {
    const chain = nonKhalaniChains.find(
      (chain) => chain.chainId === originNetwork,
    )
    if (chain) {
      return chain
    }
    return nonKhalaniChains.find(
      (chain) => chain.chainId === DEFAULT_NETWORK,
    ) as IChain
  }, [nonKhalaniChains, originNetwork])

  const destinationChain = useMemo(() => {
    const chain = nonKhalaniChains.find(
      (chain) => chain.chainId === destinationNetwork,
    )
    if (chain && chain.chainId !== originNetwork) {
      return chain
    }
    return nonKhalaniChains.filter(
      (chain) =>
        chain.chainId !== originNetwork &&
        chain.chainId !== originChain.chainId,
    )[0]
  }, [nonKhalaniChains, destinationNetwork, originNetwork, originChain])

  const swapChains = useCallback(() => {
    if (!originChain) return
    setOriginNetwork(destinationChain.chainId)
    setDestinatioNetwork(originChain.chainId)
  }, [originChain, destinationChain, setOriginNetwork])

  const handleOriginChainChange = (chain: IChain) => {
    setOriginNetwork(chain.chainId)
  }

  const handleDestinationChainChange = (chain: IChain) => {
    setDestinatioNetwork(chain.chainId)
  }

  return {
    chains: nonKhalaniChains,
    originChain,
    destinationChain,
    swapChains,
    handleOriginChainChange,
    handleDestinationChainChange,
  }
}

export const useTransactionSummary = (): IUseTransactionSummary => {
  const { account } = useWallet()
  const details = useMemo(
    () => [
      {
        id: 1,
        label: 'Solver Preference',
        value: (
          <Typography
            text={'Fastest'}
            variant="caption"
            fontWeight={700}
            color="text.secondary"
          />
        ),
      },
      // {
      //   id: 2,
      //   label: 'ETA',
      //   value: (
      //     <Typography
      //       text={'~ 5 mins'}
      //       variant="caption"
      //       fontWeight={700}
      //       color="text.secondary"
      //     />
      //   ),
      // },
      {
        id: 2,
        label: 'To address',
        value: (
          <Typography
            text={formatEthAddress(account ?? '')}
            variant="caption"
            color="text.secondary"
          />
        ),
      },
      // {
      //   id: 4,
      //   label: 'Fees',
      //   value: (
      //     <Typography
      //       text={`${bigIntToString(1n, 18)} ETH`}
      //       variant="caption"
      //       fontWeight={700}
      //       color="text.secondary"
      //     />
      //   ),
      // },
    ],
    [account],
  )

  return { details }
}

interface IUseTokenBalancesHook {
  tokenBalances: ITokenSelectorBalance[]
}
export const useTokenBalances = (): IUseTokenBalancesHook => {
  const tokenBalancesStore = useSelector(balancesSelectors.selectAll)

  const tokenBalances = useMemo(
    () =>
      tokenBalancesStore.map((tokenBalance) => ({
        tokenId: tokenBalance.id,
        balance: tokenBalance.balance,
      })),
    [tokenBalancesStore],
  )

  return { tokenBalances }
}

export const useRefine = (selectedTokenValue: bigint | undefined) => {
  const dispatch = useDispatch<StoreDispatch>()

  const createRefineOutput = useSelector(createRefineSelectors.output)
  const queryRefineOutput = useSelector(queryRefineSelectors.output)

  const [refinementStatus, setRefinementStatus] = useState<RefinementStatus>(
    RefinementStatus.NOT_INITIALIZED,
  )

  useEffect(() => {
    dispatch(queryRefineActions.clearState())
    dispatch(createRefineActions.clearState())
  }, [dispatch, selectedTokenValue])

  const refinementNotFound = useMemo(
    () => queryRefineOutput === QueryRefineErrors.RefinementNotFound,
    [queryRefineOutput],
  )

  useEffect(() => {
    if ((!createRefineOutput && !queryRefineOutput) || refinementNotFound)
      setRefinementStatus(RefinementStatus.NOT_INITIALIZED)
    else if (createRefineOutput && !queryRefineOutput)
      setRefinementStatus(RefinementStatus.INITIALIZED)
    else if (createRefineOutput && queryRefineOutput)
      setRefinementStatus(RefinementStatus.COMPLETED)
  }, [createRefineOutput, queryRefineOutput, refinementNotFound])

  useEffect(() => {
    if (!createRefineOutput || queryRefineOutput) return

    // Set up interval to dispatch the action every second
    const intervalId = setInterval(() => {
      dispatch(queryRefineActions.request(createRefineOutput))

      // Check if queryRefineOutput is filled and stop if it is
      if (queryRefineOutput) {
        clearInterval(intervalId)
      }
    }, 1000)

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [createRefineOutput, queryRefineOutput, dispatch])

  return { refinementStatus, queryRefineOutput, refinementNotFound }
}

export const useConfirmButton = (
  refinementStatus: RefinementStatus,
  selectedTokenValue: bigint | undefined,
  refinementNotFound: boolean,
) => {
  const [confirmButtonText, setConfirmButtonText] = useState<string>(
    'Run refinement',
  )

  useEffect(() => {
    if (!selectedTokenValue) {
      setConfirmButtonText('Enter an amount')
    } else if (refinementNotFound) {
      setConfirmButtonText('Insufficient liquidity for this swap')
    } else if (refinementStatus === RefinementStatus.INITIALIZED) {
      setConfirmButtonText('Calculating best price ...')
    } else if (refinementStatus === RefinementStatus.COMPLETED) {
      setConfirmButtonText('Transfer')
    }
  }, [refinementStatus, selectedTokenValue, refinementNotFound])

  return { confirmButtonText }
}
