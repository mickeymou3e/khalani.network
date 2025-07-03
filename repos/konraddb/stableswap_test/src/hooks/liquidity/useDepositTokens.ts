import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { ITokenWithBalance } from '@interfaces/token'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'

export const useDepositTokens = (): ITokenWithBalance[] => {
  const params = useParams<{ id: string }>()

  const selectPoolModelById = useSelector(poolsModelsSelector.selectById)

  return useMemo(() => {
    const poolModel = selectPoolModelById(params.id)
    return poolModel?.depositTokens as ITokenWithBalance[]
  }, [selectPoolModelById, params])
}
