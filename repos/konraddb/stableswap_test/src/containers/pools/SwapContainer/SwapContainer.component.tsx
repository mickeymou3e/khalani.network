import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import SwapModule from '@components/SwapModule/SwapModule.component'
import { IToken } from '@interfaces/token'
import { Box } from '@mui/material'
import { balancesSelectors } from '@store/balances/selectors/balances.selector'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { providerSelector } from '@store/provider/provider.selector'
import { StoreDispatch } from '@store/store.types'
import { swapSelectors } from '@store/swap/swap.selector'
import { swapActions } from '@store/swap/swap.slice'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { BigDecimal } from '@utils/math'
import { isDebtToken } from '@utils/token'

import { SLIPPAGE_DEFAULT_VALUE } from '../constants'
import { useTokenWithBalances } from './SwapContainer.hooks'

const SwapContainer: React.FC = () => {
  const { tokens } = useTokenWithBalances()
  const [slippage, setSlippage] = useState(SLIPPAGE_DEFAULT_VALUE)
  const provider = useSelector(providerSelector.provider)

  const isFetching = useSelector(balancesSelectors.loading)

  const swap = useSelector(swapSelectors.swap)
  const swapLoading = useSelector(swapSelectors.swapLoading)

  const tokensSwapPossibilitiesPre = useSelector(tokenSelectors.selectTokens)
  const pools = useSelector(poolSelectors.pools)

  const swapPossibilitiesAll = tokensSwapPossibilitiesPre.reduce(
    (swapPossibilities, { address: tokenAddress, isLpToken }) => {
      if (isLpToken || isDebtToken(tokenAddress)) {
        return swapPossibilities
      }

      const poolId = pools[0]?.id
      const restAddresses = tokensSwapPossibilitiesPre
        .map(({ address }) => address)
        .filter((restTokenAddress) => restTokenAddress !== tokenAddress)
      return {
        ...swapPossibilities,
        [tokenAddress]: restAddresses.map((address) => ({
          poolId: poolId,
          address,
        })),
      }
    },
    {} as { [key: string]: { address: string; poolId: string }[] },
  )
  const dispatch = useDispatch<StoreDispatch>()

  const onChangeHandler = useCallback(
    (baseToken: IToken, quoteToken: IToken, baseTokenAmount: BigNumber) => {
      if (baseToken && quoteToken && provider && baseTokenAmount) {
        dispatch(
          swapActions.swapPreviewRequest({
            inToken: baseToken.address,
            inTokenAmount: BigDecimal.from(baseTokenAmount, baseToken.decimals),
            outToken: quoteToken.address,
            slippage,
          }),
        )
      }
    },
    [dispatch, provider, slippage],
  )

  const onSlippageChange = useCallback(
    (slippage: number) => {
      setSlippage(slippage)
    },
    [setSlippage],
  )

  return (
    <Box pt={4} display="flex" justifyContent="center">
      <SwapModule
        tokens={tokens}
        inProgress={swapLoading}
        swapPossibilities={swapPossibilitiesAll}
        slippage={slippage}
        isFetchingBalances={isFetching}
        quoteTokenValue={swap?.outTokenAmount?.toBigNumber()}
        isFetching={swapLoading}
        onChange={onChangeHandler}
        onSlippageChange={onSlippageChange}
      />
    </Box>
  )
}

export default SwapContainer
