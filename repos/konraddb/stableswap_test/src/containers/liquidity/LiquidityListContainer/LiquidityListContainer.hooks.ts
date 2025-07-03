import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { USDC } from '@dataSource/graph/pools/poolsTokens/constants'
import { lockService } from '@libs/services/lock.service'
import { chainsSelectors } from '@store/chains/chains.selector'
import { khalaTokenSelectors } from '@store/khala/tokens/tokens.selector'
import { metricsSelectors } from '@store/metrics/metrics.selectors'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'

import {
  ILiquidityHook,
  ILiquidityList,
  IUserTVLList,
} from './LiquidityListContainer.types'

export const useLiquidity = (): ILiquidityHook => {
  const chainSelector = useSelector(chainsSelectors.selectById)
  const selectPoolModels = useSelector(poolsModelsSelector.selectAll)

  const selectPoolTotalValueUSD = useSelector(
    metricsSelectors.selectPoolTotalValueUSD,
  )
  const selectPoolVolume24hUSD = useSelector(
    metricsSelectors.selectPoolVolume24hUSD,
  )
  const selectChain = useSelector(chainsSelectors.selectByTokenSymbol)
  const allTokens = useSelector(khalaTokenSelectors.selectAll)

  const [userTVLList, setUserTVLList] = useState<IUserTVLList[]>([])

  const liquidityList = useMemo(
    () =>
      selectPoolModels.map((poolModel) => {
        const poolToken = poolModel.depositTokens.find((token) =>
          token.symbol.includes(USDC.symbol),
        )
        const poolTotalValueUSD = selectPoolTotalValueUSD(poolModel.id)
        const volume24hUSD = selectPoolVolume24hUSD(poolModel.id)
        const chain = selectChain(poolToken?.symbol)

        if (!poolToken || !chain) {
          return
        }

        return {
          id: poolModel.id,
          token: poolToken,
          chain,
          tvl: poolTotalValueUSD,
          volume: volume24hUSD,
        }
      }) as ILiquidityList[],
    [
      selectPoolModels,
      selectPoolTotalValueUSD,
      selectPoolVolume24hUSD,
      selectChain,
    ],
  )

  useEffect(() => {
    const fetchUserTVLData = async () => {
      const tvls = await lockService.getUserTVL()
      const tvlList: IUserTVLList[] = []
      tvls.map((tvl) => {
        const token = allTokens.find(
          (token) => token.address === tvl.tokenAddress,
        )
        if (!token) {
          return
        }
        const chain = chainSelector(token.chainId)
        if (chain) {
          tvlList.push({ ...tvl, token, chain })
        }
      })
      setUserTVLList(tvlList)
    }
    fetchUserTVLData().catch(console.error)
  }, [chainSelector, allTokens])

  return { liquidityList, userTVLList }
}
