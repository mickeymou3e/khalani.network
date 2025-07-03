import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'

import { ActionInProgress } from '@constants/Action'
import { IReserve, TokenModel } from '@interfaces/tokens'
import { initializeStoreSelectors } from '@store/initializeStore/initializeStore.selector'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'

export const useGetBackstopAssetFromSlug = (): IReserve | undefined | null => {
  const [asset, setAsset] = useState<IReserve | undefined | null>(null)
  const reserveSelector = useSelector(reservesSelectors.selectById)
  const tokens = useSelector(tokenSelectors.selectAll)

  const isInitialized = useSelector(initializeStoreSelectors.isInitialized)

  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (isInitialized) {
      const token = tokens.find(
        (token) => token.address.toLowerCase() === id.toLowerCase(),
      )
      const reserve = reserveSelector(token?.id)

      setAsset(reserve)
    }
  }, [tokens, id, isInitialized, reserveSelector])

  return asset
}

export const useGetAssetFromSlug = (): TokenModel | undefined | null => {
  const [asset, setAsset] = useState<TokenModel | undefined | null>(null)

  const tokens = useSelector(tokenSelectors.selectAll)
  const isInitialized = useSelector(initializeStoreSelectors.isInitialized)

  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (isInitialized) {
      const token = tokens.find(
        (token) => token.address.toLowerCase() === id.toLowerCase(),
      )
      setAsset(token)
    }
  }, [tokens, id, isInitialized])

  return asset
}

export const useQuery = (): URLSearchParams => {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

export const useOnActionCompleted = (
  actionType: ActionInProgress,
  currentAction?: ActionInProgress,
  callback?: () => void,
): void => {
  const previousAction = useRef(currentAction)

  useEffect(() => {
    if (previousAction.current === actionType && currentAction === undefined) {
      callback?.()
    }

    previousAction.current = currentAction
  }, [actionType, currentAction, callback])
}
