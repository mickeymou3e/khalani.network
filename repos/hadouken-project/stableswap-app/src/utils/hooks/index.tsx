import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import _ from 'lodash'

import { networkActions } from '@store/network/network.slice'
import {
  ConnectionStageStatus,
  ConnectionStageType,
} from '@store/wallet/connection/types'
import { walletActions } from '@store/wallet/wallet.slice'
import { checkIsSupportedNetworkInUrl } from '@utils/network'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

function deepCompareEquals(a: unknown, b: unknown) {
  return _.isEqual(a, b)
}

function useDeepCompareMemoize(value: unknown) {
  const ref = useRef<unknown>()
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier

  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

export function useDeepCompareEffect(
  callback: () => void,
  dependencies: unknown[],
): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, [...dependencies.map(useDeepCompareMemoize)])
}

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export const usePathWatcher = (): void => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()

  const supportedNetwork = checkIsSupportedNetworkInUrl(pathname)

  const previousChain = usePrevious(supportedNetwork?.chainId)

  useEffect(() => {
    if (supportedNetwork && previousChain !== supportedNetwork.chainId) {
      dispatch(networkActions.setApplicationChainId(supportedNetwork.chainId))
      dispatch(
        networkActions.setApplicationNetworkName(supportedNetwork.chainId),
      )
      dispatch(
        walletActions.changeConnectionStage({
          type: ConnectionStageType.Idle,
          status: ConnectionStageStatus.Pending,
        }),
      )
    }
  }, [dispatch, supportedNetwork, previousChain])
}
