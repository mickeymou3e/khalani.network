import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { useWallet, DEFAULT_NETWORK } from '@shared/store'
import {
  balancesSelectors,
  chainsSelectors,
  IChain,
  KHALA_SYMBOL,
  Network,
  TokenModel,
  tokenSelectors,
} from '@tvl-labs/sdk'

export const useChainSelector = () => {
  const wallet = useWallet()
  const currentChain = wallet.network

  const nonKhalaniChains = useSelector(
    chainsSelectors.chainsWithoutBalancerChain,
  )

  const [selectedChain, setSelectedChain] = useState<IChain | undefined>(
    nonKhalaniChains.find((chain) => chain.chainId === DEFAULT_NETWORK),
  )
  useEffect(() => {
    if (currentChain) {
      let foundChain = nonKhalaniChains.find(
        (chain) => chain.chainId === currentChain,
      )
      if (!foundChain) {
        foundChain = nonKhalaniChains.find(
          (chain) => chain.chainId === Network.ArbitrumSepolia,
        )
      }
      setSelectedChain(foundChain)
    }
  }, [currentChain, nonKhalaniChains])

  const handleChainChange = (chain: IChain) => {
    setSelectedChain(chain)
  }

  const chains = useMemo(
    () =>
      nonKhalaniChains.filter(
        (chain) => chain.chainId !== selectedChain?.chainId,
      ),
    [nonKhalaniChains, selectedChain],
  )

  return {
    chains,
    selectedChain,
    handleChainChange,
  }
}

export const useTokenSelector = (selectedChain: IChain | undefined) => {
  const [selectedToken, setSelectedToken] = useState<TokenModel | undefined>(
    undefined,
  )

  const selectByNetwork = useSelector(tokenSelectors.selectByNetwork)
  const tokens = useMemo(() => {
    if (!selectedChain) return []
    return selectByNetwork(selectedChain.chainId).filter(
      (token) => token.symbol !== KHALA_SYMBOL,
    )
  }, [selectedChain, selectByNetwork])

  useEffect(() => {
    setSelectedToken(tokens[0])
  }, [tokens])

  const handleTokenChange = (token: TokenModel) => {
    setSelectedToken(token)
  }

  return {
    tokens,
    selectedToken,
    handleTokenChange,
  }
}

export const useProvideLiquidity = (selectedToken: TokenModel | undefined) => {
  const [amount, setAmount] = useState<bigint | undefined>(undefined)
  const [tokenBalance, setTokenBalance] = useState<bigint | undefined>(
    undefined,
  )
  const selectBalanceById = useSelector(balancesSelectors.selectById)

  useEffect(() => {
    const foundBalance = selectBalanceById(selectedToken?.id ?? '')
    setTokenBalance(foundBalance?.balance)
  }, [selectBalanceById, selectedToken?.id])

  const handleAmountChange = (amount: bigint) => setAmount(amount)

  return {
    amount,
    tokenBalance,
    handleAmountChange,
  }
}

export const useChainPicker = () => {
  const chains = useSelector(chainsSelectors.chainsWithoutBalancerChain)

  const [selectedChains, setSelectedChains] = useState<
    { id: number; name: string }[]
  >([])

  const handleChainDelete = (id: number) => {
    setSelectedChains(selectedChains.filter((chain) => chain.id !== id))
  }

  const handleChainSelect = (id: number) => {
    const newChain = chains.find((chain) => chain.id === id)
    const isSameChain = selectedChains.some((chain) => chain.id === id)
    if (!newChain || !selectedChains || isSameChain) return
    setSelectedChains([
      ...selectedChains,
      { id: newChain.id, name: newChain.chainName },
    ])
  }
  return {
    selectedChains,
    chains,
    handleChainDelete,
    handleChainSelect,
  }
}

export const useFeeSelector = () => {
  const fees = ['0.002', '0.005', '0.01']

  const [selectedFee, setFee] = useState<string>('0.002')

  const handleFeeChange = (fee: string) => {
    setFee(fee)
  }

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const test = +event.target.value / 100
    setFee(test.toString())
  }

  return { fees, selectedFee, handleFeeChange, handleTextFieldChange }
}
